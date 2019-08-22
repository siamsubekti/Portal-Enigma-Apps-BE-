import * as moment from 'moment';
import { IORedis } from 'redis';
import { verify as jwtVerify, sign as jwtSign } from 'jsonwebtoken';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Validator } from 'class-validator';
import { RedisService } from 'nestjs-redis';
import {
  AccountRegisterDTO,
  JwtActivationPayload,
  AccountRegisterResponseDTO,
  AccountRegistrationCredential,
} from '../models/register.dto';
import { AccountStatus } from '../../../config/constants';
import AppConfig from '../../../config/app.config';
import HashUtil from '../../../libraries/utilities/hash.util';
import MailerUtil from '../../../libraries/mailer/mailer.util';
import TemplateUtil from '../../../libraries/utilities/template.util';
import Profile from '../../accounts/models/profile.entity';
import Account from '../../accounts/models/account.entity';
import AccountService from '../../accounts/services/account.service';
import ProfileService from '../../accounts/services/profile.service';

@Injectable()
export default class RegisterService {
  constructor(
    private readonly accountService: AccountService,
    private readonly profileService: ProfileService,
    private readonly hashUtil: HashUtil,
    private readonly mailUtil: MailerUtil,
    private readonly templateUtil: TemplateUtil,
    private readonly redisService: RedisService,
    private readonly config: AppConfig,
  ) {}

  async preActivation(key: string, token: string): Promise<AccountRegisterDTO> {
    const client: IORedis.Redis = await this.redisService.getClient();
    const jwt: string = await client.get(key);

    try {
      if (!jwt)
        throw new Error('Invalid activation key.');

      const payload: JwtActivationPayload = jwtVerify(jwt, this.config.get('HASH_SECRET')) as JwtActivationPayload;

      if (payload.token !== token)
        throw new Error('Invalid activation token.');

      return payload.account;
    } catch (exception) {
      Logger.error(exception, undefined, 'RegisterService', true);

      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Account activation cannot continue due to invalid key/token combination.`,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async preRegister(form: AccountRegisterDTO): Promise<AccountRegisterResponseDTO> {
    await this.validateForm(form);

    const credential: AccountRegistrationCredential = await this.storeRegistrationData(form);
    this.sendActivationEmail(credential);

    return {
      accountId: credential.key,
      status: 'NEW',
    };
  }

  async register(key: string, form: AccountRegisterDTO): Promise<AccountRegisterResponseDTO> {
    try {
      let profile: Profile = new Profile();
      profile.fullname = form.fullname;
      profile.nickname = this.getNickname(form.fullname);
      profile.email = form.username;
      profile.phone = form.phone;
      profile.birthdate = moment(form.birthDate, 'DD-MM-YYYY').toDate();
      profile = await this.profileService.save(profile);

      let account: Account = new Account();
      account.username = form.username;
      account.password = form.password;
      account.profile = profile;
      account.status = AccountStatus.ACTIVE;
      account.roles = Promise.resolve([]);
      account = await this.accountService.save(account);

      const client: IORedis.Redis = await this.redisService.getClient();
      await client.del(key);
      return { accountId: account.id, status: account.status };
    } catch (error) {
      return null;
    }
  }

  private async validateForm(form: AccountRegisterDTO): Promise<void> {
    const validator: Validator = new Validator();

    if (await this.accountService.countByUsername(form.username) > 0)
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Form validation failed: this username/email already registered to another account.`,
      }, HttpStatus.BAD_REQUEST);

    if (!validator.equals(form.confirmPassword, form.password))
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Form validation failed: please type the same exact value as password field in the confirmPassword field.`,
      }, HttpStatus.BAD_REQUEST);
  }

  private async storeRegistrationData(account: AccountRegisterDTO): Promise<AccountRegistrationCredential> {
    account = await this.prepareData(account);

    const expiresIn: number = Number(this.config.get('PASSWORD_RESET_EXPIRES')); // 30 minutes in seconds
    const key: string = await this.hashUtil.createMd5Hash(`${account.fullname}-${account.username}-${moment().valueOf()}-activation`);
    const token: string = this.hashUtil.createRandomString(72);
    const jwt: string = jwtSign({ account, token }, this.config.get('HASH_SECRET'), { expiresIn });
    const client: IORedis.Redis = await this.redisService.getClient();

    await client.set(key, jwt);
    await client.expire(key, expiresIn);

    return { account, key, token };
  }

  private async sendActivationEmail(credential: AccountRegistrationCredential): Promise<boolean> {
    try {
      const { account: { username: to, fullname: name }, key, token } = credential;
      const activationLink: string = `${this.config.get('FRONTEND_PORTAL_URL')}/register/activation/${key}/${token}`;
      const html: string = await this.templateUtil.renderToString('auth/account-activation.mail.hbs', {
        name, activationLink, baseUrl: this.config.get('API_BASE_URL'),
      });

      const response: any = await this.mailUtil.send({
        from: this.config.get('MAIL_SENDER'),
        to,
        subject: 'Enigma Portal Account Activation',
        html,
      });

      return ( response ? true : false);
    } catch (exception) {
      Logger.error(exception, exception, 'RegisterService @sendActivationEmail');

      return false;
    }
  }

  private async prepareData(account: AccountRegisterDTO): Promise<AccountRegisterDTO> {
    account.password = await this.hashUtil.create(account.password);
    delete account.confirmPassword;

    return account;
  }

  private getNickname(fullname: string): string {
    return fullname.indexOf(' ') > 0 ? fullname.substring(0, fullname.indexOf(' ')) : fullname;
  }
}
