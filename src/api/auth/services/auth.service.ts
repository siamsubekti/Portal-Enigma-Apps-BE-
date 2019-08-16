import * as moment from 'moment';
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';
import { IORedis } from 'redis';
import { Validator } from 'class-validator';
import { RedisService } from 'nestjs-redis';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { LoginCredentialDTO, LoginResponseDTO, JwtPayload } from '../models/auth.dto';
import { PasswordResetRequestDTO, PasswordResetCredential, PasswordResetDTO, PasswordResetPayload } from '../models/password-reset.dto';
import { AccountPrivilege } from '../../accounts/models/account.dto';
import { AccountStatus } from '../../../config/constants';
import AppConfig from '../../../config/app.config';
import HashUtil from '../../../libraries/utilities/hash.util';
import MailerUtil from '../../../libraries/mailer/mailer.util';
import TemplateUtil from '../../../libraries/utilities/template.util';
import Account from '../../accounts/models/account.entity';
import AccountService from '../../accounts/services/account.service';
import ServicesService from 'src/api/master/services/services/services.service';

@Injectable()
export default class AuthService {
  constructor(
    private readonly service: ServicesService,
    private readonly accountService: AccountService,
    private readonly hashUtil: HashUtil,
    private readonly mailUtil: MailerUtil,
    private readonly templateUtil: TemplateUtil,
    private readonly redisService: RedisService,
    private readonly config: AppConfig,
  ) { }

  async getAccountPrivileges(accountId: string): Promise<AccountPrivilege> {
    try {
      return this.accountService.buildAccountPrivileges(accountId);
    } catch (error) {
      Logger.error('');
      return undefined;
    }
  }

  async login(credential: LoginCredentialDTO): Promise<LoginResponseDTO> {
    let loginResponse: LoginResponseDTO = null;
    const account: Account = await this.accountService.findByUsername(credential.username);

    try {
      if (!account) {
        const suspendedAccount: Account = await this.accountService.findSuspendedAccount(credential.username);
        if (suspendedAccount && await this.hashUtil.compare(credential.password, suspendedAccount.password))
          loginResponse = {
            accountId: suspendedAccount.id,
            sessionId: null,
            redirectTo: null,
          };
        return loginResponse;
      } else if (account && await this.hashUtil.compare(credential.password, account.password))
        loginResponse = {
          accountId: account.id,
          sessionId: await this.createSession(account),
          redirectTo: await this.service.findByCode('MST_ACCOUNT_PRIVILEGES'),
        };

      // Logger.log({ account }, 'AuthService@login', true);

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

        return !(await client.exists(sessionId));
      }
    } catch (error) {
      Logger.error(error, undefined, 'AuthService');
      return false;
    }
  }

  async prePasswordReset(form: PasswordResetRequestDTO): Promise<void> {
    const account: Account = await this.accountService.findByUsername(form.username);

    if (!account) throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: `Account data related to this email could not be found.`,
    }, HttpStatus.NOT_FOUND);

    try {
      const expiresIn: number = Number(this.config.get('PASSWORD_RESET_EXPIRES')); // 30 minutes in seconds
      const client: IORedis.Redis = await this.redisService.getClient();
      const key: string = this.hashUtil.createMd5Hash(`${account.id}-${account.username}-${moment().valueOf()}-password-reset`);
      const token: string = await this.hashUtil.create(`${account.id}-${account.username}-${moment().valueOf()}-${key}`);
      const jwt: string = jwtSign({ aid: account.id, token }, this.config.get('HASH_SECRET'), { expiresIn });

      await this.accountService.setStatus(account.id, AccountStatus.SUSPENDED);
      await client.set(key, jwt);
      await client.expire(key, expiresIn); // 30 minutes in seconds
      this.sendPasswordResetEmail({ account, key, token });

    } catch (exception) {
      Logger.error(exception, undefined, 'AuthService', true);

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `An error occured during password reset request process.`,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async passwordReset(form: PasswordResetDTO, key: string, token: string): Promise<void> {
    const validator: Validator = new Validator();

    if (validator.notEquals(form.confirmPassword, form.password))
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Form validation failed: field confirm password must have the exact same value as password field.`,
      }, HttpStatus.BAD_REQUEST);

    try {
      const client: IORedis.Redis = await this.redisService.getClient();
      const jwt: string = await client.get(key);

      if (!jwt)
        throw new Error('Invalid password reset request key.');

      const payload: PasswordResetPayload = jwtVerify(jwt, this.config.get('HASH_SECRET')) as PasswordResetPayload;

      if (validator.notEquals(token, payload.token))
        throw new Error('Invalid password reset request token.');

      form.password = await this.hashUtil.create(form.password);
      await this.accountService.resetPassword(payload.aid, form.password);

    } catch (exception) {
      Logger.error(exception);

      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Password reset cannot continue due to invalid key/token combination.`,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async validateSession(cookie: string): Promise<Account> {
    try {
      const client: IORedis.Redis = await this.redisService.getClient();
      const token: string = await client.get(cookie);
      const payload: JwtPayload = jwtVerify(token, this.config.get('HASH_SECRET')) as JwtPayload;
      const account: Account = await this.accountService.get(payload.aid);

      // Logger.log({account, payload, token}, 'AuthService@validateSession', true);
      return account;

    } catch (error) {
      Logger.error(error, undefined, 'AuthService');
      return null;
    }
  }

  private async createSession(account: Account): Promise<string> {
    const expiresIn: number = Number(this.config.get('SESSION_EXPIRES')) / 1000; // 1 day in seconds
    const client: IORedis.Redis = await this.redisService.getClient();
    const sessionId: string = this.hashUtil.createMd5Hash(`${account.id}-${account.username}-${moment().valueOf()}-session`);
    const payload: JwtPayload = { aid: account.id };
    const token: string = jwtSign(payload, this.config.get('HASH_SECRET'), { expiresIn });

    // Logger.log({account, sessionId, token}, 'AuthService@createSession', true);
    await client.set(sessionId, token);
    await client.expire(sessionId, expiresIn);
    return sessionId;
  }

  private async sendPasswordResetEmail(credential: PasswordResetCredential): Promise<boolean> {
    try {
      const { account: { profile: { fullname: name }, username: to }, key, token } = credential;
      const resetPasswordLink: string = encodeURI(`${this.config.get('FRONTEND_PORTAL_URL')}/auth/forgot-password/${key}/${token}`);
      const html: string = await this.templateUtil.renderToString('auth/password-reset.mail.hbs', {
        name, resetPasswordLink, baseUrl: this.config.get('API_BASE_URL'),
      });
      const response: any = await this.mailUtil.send({
        from: this.config.get('MAIL_SENDER'),
        to,
        subject: 'Enigma Portal Account Password Reset',
        html,
      });

      return (response ? true : false);
    } catch (exception) {
      Logger.error(exception, exception, 'AuthService @sendPasswordResetEmail');

      return false;
    }
  }
}
