import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import ConfigModule from '../../config/config.module';
import AccountModule from '../accounts/account.module';
import RoleModule from '../master/roles/role.module';
import ServicesModule from '../master/services/services.module';
import CookieStrategy from './strategies/cookie.strategy';
import AuthController from './controllers/auth.controller';
import AuthService from './services/auth.service';
import RegisterController from './controllers/register.controller';
import RegisterService from './services/register.service';
import AuthCandidateController from './controllers/auth-candidate.controller';
import CaptchaController from './controllers/captcha.controller';
import CaptchaService from './services/captcha.service';

@Module({
  imports: [
    ConfigModule,
    AccountModule,
    RoleModule,
    ServicesModule,
    PassportModule.register({defaultStrategy: 'cookie', property: 'account', session: false}),
  ],
  exports: [ AuthService, RegisterService, CaptchaService, CookieStrategy ],
  providers: [ AuthService, RegisterService, CaptchaService, CookieStrategy ],
  controllers: [ AuthController, RegisterController, AuthCandidateController, CaptchaController ],
})
export default class AuthModule {}
