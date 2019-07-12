import * as moment from 'moment';
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken';
import { IORedis } from 'redis';
import { RedisService } from 'nestjs-redis';
import { Injectable, Logger, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { LoginCredentialDTO, LoginResponseDTO, AccountRegisterDTO, AccountRegisterResponseDTO, JwtPayload } from '../models/auth.dto';
import { AppConfig } from '../../../config/app.config';
import HashUtil from '../../../libraries/utilities/hash.util';
import Account from '../../accounts/models/account.entity';
import Profile from '../../accounts/models/profile.entity';
import AccountService from '../../accounts/services/account.service';
import ProfileService from '../../accounts/services/profile.service';
import { Repository } from 'typeorm';

@Injectable()
export default class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private readonly profileService: ProfileService,
    private readonly hashUtil: HashUtil,
    private readonly redisService: RedisService,
    private readonly config: AppConfig,
  ) {}

  private async createSession(account: Account): Promise<string> {
    const sessionId: string = this.hashUtil.createMd5Hash(`${account.id}-${account.username}-${moment().valueOf()}`);
    const token: string = jwtSign({ aid: account.id }, this.config.get('HASH_SECRET'));
    const client: IORedis.Redis = await this.redisService.getClient();

    await client.set(sessionId, token);
    return sessionId;
  }

  async login(credential: LoginCredentialDTO): Promise<LoginResponseDTO> {
    let loginResponse: LoginResponseDTO = null;
    const account: Account = await this.accountService.findByUsername(credential.username);
    try {
      if ( account && await this.hashUtil.compare(credential.password, account.password) ) {
        loginResponse = {
          accountId: account.id,
          sessionId: await this.createSession(account),
        };
      }

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

  async register(form: AccountRegisterDTO): Promise<AccountRegisterResponseDTO> {
    try {
      let profile: Profile = new Profile();
      profile.fullname = form.fullname;
      profile.nickname = form.fullname.substring(0, form.fullname.indexOf(' '));
      profile.email = form.username;
      profile.phone = form.phone;
      profile = await this.profileService.save(profile);

      let account: Account = new Account();
      account.username = form.username;
      account.password = await this.hashUtil.create(form.password);
      account.profile = profile;
      account = await this.accountService.save(account);

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
}
