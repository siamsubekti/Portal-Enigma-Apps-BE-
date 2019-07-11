import * as Strategy from 'passport-cookie';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import AuthService from '../services/auth.service';
import Account from '../../accounts/models/account.entity';

@Injectable()
export default class CookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor(private readonly authService: AuthService) {
    super({
      cookieName: 'EPSESSION',
    });
  }

  async validate(cookie: string, done: any) {
    // console.log(payload);
    const account: Account = await this.authService.validateSession(cookie);

    if (!account) throw new UnauthorizedException(`Session invalid.`);

    return done(null, account);
  }
}
