import * as moment from 'moment';
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';
import { IORedis } from 'redis';
import { Validator } from 'class-validator';
import { RedisService } from 'nestjs-redis';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { LoginCredentialDTO, LoginResponseDTO, AccountRegisterDTO, AccountRegisterResponseDTO, JwtPayload, AccountRegistrationCredential, JwtActivationPayload } from '../models/auth.dto';
import { AppConfig } from '../../../config/app.config';
import HashUtil from '../../../libraries/utilities/hash.util';
import Account from '../../accounts/models/account.entity';
import Profile from '../../accounts/models/profile.entity';
import AccountService from '../../accounts/services/account.service';
import ProfileService from '../../accounts/services/profile.service';
import MailerUtil from '../../../libraries/mailer/mailer.util';

@Injectable()
export default class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly profileService: ProfileService,
    private readonly hashUtil: HashUtil,
    private readonly mailUtil: MailerUtil,
    private readonly redisService: RedisService,
    private readonly config: AppConfig,
  ) {}

  async login(credential: LoginCredentialDTO): Promise<LoginResponseDTO> {
    let loginResponse: LoginResponseDTO = null;
    const account: Account = await this.accountService.findByUsername(credential.username);
    try {
      if ( account && await this.hashUtil.compare(credential.password, account.password) )
        loginResponse = {
          accountId: account.id,
          sessionId: await this.createSession(account),
        };

      return loginResponse;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  async logout(sessionId: string): Promise<boolean> {
    try {
      const client: IORedis.Redis = await this.redisService.getClient();

      if (!(await client.exists(sessionId))) return false;
      else {
        await client.unlink(sessionId);

        return !( await client.exists(sessionId) );
      }
    } catch (error) {
      Logger.error(error, undefined, 'AuthService');
      return false;
    }
  }

  async preRegister(form: AccountRegisterDTO): Promise<AccountRegisterResponseDTO> {
    await this.validateForm(form);
    const credential: AccountRegistrationCredential = await this.storeRegistrationData(form);
    const response: any = await this.sendActivationEmail(form, credential);

    return {
      accountId: credential.key,
      status: 'NEW',
    };
  }

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
      Logger.error(exception, undefined, 'AuthService', true);

      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Account activation cannot continue due to invalid key/token combination.`,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async register(key: string, form: AccountRegisterDTO): Promise<AccountRegisterResponseDTO> {
    try {
      let profile: Profile = new Profile();
      profile.fullname = form.fullname;
      profile.nickname = this.getNickname(form.fullname);
      profile.email = form.username;
      profile.phone = form.phone;
      profile = await this.profileService.save(profile);

      let account: Account = new Account();
      account.username = form.username;
      account.password = form.password;
      account.profile = profile;
      account.status = 'ACTIVE';
      account = await this.accountService.save(account);

      const client: IORedis.Redis = await this.redisService.getClient();
      await client.del(key);
      return { accountId: account.id, status: account.status };
    } catch (error) {
      return null;
    }
  }

  async validateSession(cookie: string): Promise<Account> {
    try {
      const client: IORedis.Redis = await this.redisService.getClient();
      const token: string = await client.get(cookie);
      const payload: JwtPayload = jwtVerify(token, this.config.get('HASH_SECRET')) as JwtPayload;

      return await this.accountService.get(payload.accountId);

    } catch (error) {
      Logger.error(error, undefined, 'AuthService');
      return null;
    }
  }

  private async createSession(account: Account): Promise<string> {
    const sessionId: string = this.hashUtil.createMd5Hash(`${account.id}-${account.username}-${moment().valueOf()}`);
    const token: string = jwtSign({ aid: account.id }, this.config.get('HASH_SECRET'), { expiresIn: '1d' });
    const client: IORedis.Redis = await this.redisService.getClient();

    await client.set(sessionId, token);
    await client.expire(sessionId, 86400);
    return sessionId;
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

  private async prepareData(account: AccountRegisterDTO): Promise<AccountRegisterDTO> {
    account.password = await this.hashUtil.create(account.password);
    delete account.confirmPassword;

    return account;
  }

  private async storeRegistrationData(account: AccountRegisterDTO): Promise<AccountRegistrationCredential> {
    account = await this.prepareData(account);

    const key: string = await this.hashUtil.createMd5Hash(`${account.fullname}-${account.username}-${moment().valueOf()}`);
    const token: string = await this.hashUtil.create(`${account.fullname}-${account.username}-${moment().valueOf()}`);
    const jwt: string = jwtSign({ account, token }, this.config.get('HASH_SECRET'), { expiresIn: 600 }); // 1800
    const activationLink: string = `${this.config.get('API_BASE_URL')}/portal/activation/${encodeURI(key)}/${encodeURI(token)}`;
    const client: IORedis.Redis = await this.redisService.getClient();

    await client.set(key, jwt);
    await client.expire(key, 600); // 1800

    return { owner: account.username, key, token, activationLink };
  }

  private sendActivationEmail(account: AccountRegisterDTO, credential: AccountRegistrationCredential): void {
    this.mailUtil.send({
      from: this.config.get('MAIL_SENDER'),
      to: credential.owner,
      subject: 'Enigma Portal Account Activation',
      html: `<h1 style="width: 80%; margin: 30px auto;">Hi ${account.fullname},<br><br>Please <a href="${credential.activationLink}">Activate Your Account.</a></h1>`,
    });
  }

  private getNickname(fullname: string): string {
    return fullname.indexOf(' ') > 0 ? fullname.substring(0, fullname.indexOf(' ')) : fullname;
  }
}
