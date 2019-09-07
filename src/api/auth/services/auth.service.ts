import * as moment from 'moment-timezone';
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';
import { IORedis } from 'redis';
import { Validator } from 'class-validator';
import { RedisService } from 'nestjs-redis';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { AccountStatus } from '../../../config/constants';
import { AccountPrivilege } from '../../accounts/models/account.dto';
import { LoginCredentialDTO, LoginResponseDTO, JwtPayload } from '../models/auth.dto';
import { PasswordResetRequestDTO, PasswordResetCredential, PasswordResetDTO, PasswordResetPayload } from '../models/password-reset.dto';
import AppConfig from '../../../config/app.config';
import HashUtil from '../../../libraries/utilities/hash.util';
import MailerUtil from '../../../libraries/mailer/mailer.util';
import TemplateUtil from '../../../libraries/utilities/template.util';
import Account from '../../accounts/models/account.entity';
import AccountService from '../../accounts/services/account.service';
import Service from '../../master/services/models/service.entity';
import ServicesService from '../../master/services/services/services.service';

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

  async getFrontofficeAuthService(): Promise<Service[]> {
    return await this.service.findAllPublicFrontofficeServices();
  }

  async getBackofficeAuthService(): Promise<Service[]> {
    return await this.service.findAllPublicBackofficeServices();
  }

  async getAccountPrivileges(accountId: string): Promise<AccountPrivilege> {
    try {
      return this.accountService.buildAccountPrivileges(accountId);
    } catch (error) {
      Logger.error(error, undefined, 'AuthService@getAccountPrivileges', true);
      return undefined;
    }
  }

  async login(credential: LoginCredentialDTO): Promise<LoginResponseDTO> {
    let loginResponse: LoginResponseDTO = null;
    let account: Account = await this.accountService.findByUsername(credential.username, credential.candidate);
    if (!account) account = await this.accountService.findSuspendedAccount(credential.username);

    if (!account) return null;

    try {
      const validPassword: boolean = await this.hashUtil.compare(credential.password, account.password);

      if (validPassword)
        loginResponse = {
          accountId: account.id,
          accountStatus: account.status,
          sessionId: account.status === AccountStatus.ACTIVE ? await this.createSession(account) : null,
          redirectTo: account.status === AccountStatus.ACTIVE ? await this.service.findByCode('MST_ACCOUNT_PRIVILEGES') : null,
        };
      else Logger.warn('Invalid account credential.');

      // Logger.log(account, 'AuthService@login', true);

      if (account.status === AccountStatus.SUSPENDED && !account.lastlogin) {
        const { key, token } = await this.prePasswordCreate(account);

        loginResponse.sessionId = `${key}/${token}`;
      } else Logger.log(`Account status ${account.status} (not suspended).`);

      // Logger.log({ account }, 'AuthService@login', true);
      if (account.status === AccountStatus.ACTIVE) {
        account.lastlogin = moment().toDate();
        await this.accountService.save(account);
      } else Logger.log(`Account status ${account.status} (not active).`);

      return loginResponse;
    } catch (error) {
      Logger.error(error, undefined, 'AuthService@login', true);
      return null;
    }
  }

  async logout(sessionId: string): Promise<boolean> {
    try {
      const client: IORedis.Redis = await this.redisService.getClient();
      const deleted: boolean = ( await client.unlink(sessionId) > 0 );

      if ( deleted ) Logger.log(`Session ID ${sessionId} deleted.`, 'AuthService@logout', true);
      else Logger.warn(`Invalid session ID ${sessionId}.`, 'AuthService@logout', true);

      return deleted;
    } catch (error) {
      Logger.error(error, undefined, 'AuthService@logout', true);
      return false;
    }
  }

  async prePasswordReset(form: PasswordResetRequestDTO): Promise<boolean> {
    const account: Account = await this.accountService.findByEmail(form.username, form.candidate);

    if (!account) throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: `Account data related to this email could not be found.`,
    }, HttpStatus.NOT_FOUND);

    try {
      const expiresIn: number = Number(this.config.get('PASSWORD_RESET_EXPIRES')); // 30 minutes in seconds
      const client: IORedis.Redis = await this.redisService.getClient();
      const key: string = this.hashUtil.createMd5Hash(`${account.id}-${account.username}-${moment().valueOf()}-password-reset`);
      const token: string = this.hashUtil.createRandomString(72);
      const jwt: string = jwtSign({ aid: account.id, token }, this.config.get('HASH_SECRET'), { expiresIn });

      await this.accountService.setStatus(account.id, AccountStatus.SUSPENDED);
      await client.set(key, jwt);
      await client.expire(key, expiresIn); // 30 minutes in seconds
      this.sendPasswordResetEmail({ account, key, token }, form.candidate);

      return true;

    } catch (exception) {
      Logger.error(exception, undefined, 'AuthService@prePasswordReset', true);

      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `An error occured during password reset request process.`,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async passwordReset(form: PasswordResetDTO, key: string, token: string): Promise<LoginResponseDTO> {
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
      const account: Account = await this.accountService.resetPassword(payload.aid, form.password);

      return {
        accountId: account.id,
        accountStatus: account.status,
        sessionId: null,
        redirectTo: await this.service.findByCode('AUTH_LOGIN'),
      };

    } catch (exception) {
      Logger.error(exception, undefined, `AuthService@passwordReset`, true);

      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `Password reset cannot continue due to invalid key/token combination.`,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  async prePasswordCreate(account: Account): Promise<PasswordResetCredential> {
    const expiresIn: number = +this.config.get('PASSWORD_RESET_EXPIRES'); // 30 minutes in seconds
    const client: IORedis.Redis = await this.redisService.getClient();
    const key: string = this.hashUtil.createMd5Hash(`${account.id}-${account.username}-${moment().valueOf()}-password-reset`);
    const token: string = this.hashUtil.createRandomString(72);
    const jwt: string = jwtSign({ aid: account.id, token }, this.config.get('HASH_SECRET'), { expiresIn });

    // await this.accountService.setStatus(account.id, AccountStatus.SUSPENDED);
    await client.set(key, jwt);
    await client.expire(key, expiresIn); // 30 minutes in seconds

    return { account, key, token };
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
      Logger.error(error, undefined, 'AuthService@validateSession', true);
      return null;
    }
  }

  private async createSession(account: Account): Promise<string> {
    const expiresIn: number = +this.config.get('SESSION_EXPIRES'); // 1 day in seconds
    const client: IORedis.Redis = await this.redisService.getClient();
    const sessionId: string = this.hashUtil.createMd5Hash(`${account.id}-${account.username}-${moment().valueOf()}-session`);
    const payload: JwtPayload = { aid: account.id };
    const token: string = jwtSign(payload, this.config.get('HASH_SECRET'), { expiresIn });

    // Logger.log({account, sessionId, token}, 'AuthService@createSession', true);
    await client.set(sessionId, token);
    await client.expire(sessionId, expiresIn);
    return sessionId;
  }

  private async sendPasswordResetEmail(credential: PasswordResetCredential, candidate: boolean): Promise<boolean> {
    try {
      let baseUrl: string = this.config.get('FRONTEND_BACKOFFICE_URL');
      if (candidate) baseUrl = this.config.get('FRONTEND_PORTAL_URL');

      const { account: { profile: { fullname: name, email: to } }, key, token } = credential;
      const resetPasswordLink: string = encodeURI(`${baseUrl}/#/auth/password/reset/${key}/${token}`);
      const html: string = await this.templateUtil.renderToString('auth/password-reset.mail.hbs', {
        name, resetPasswordLink, baseUrl,
      });

      const config: any = {
        from: this.config.get('MAIL_SENDER'),
        to: `${name}<${to}>`,
        subject: 'Enigma Portal Account Password Reset',
        html,
      };

      const response: any = await this.mailUtil.send(config);
      return (response ? true : false);
    } catch (exception) {
      Logger.error(exception, undefined, 'AuthService@sendPasswordResetEmail', true);

      return false;
    }
  }
}
