import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import AccountModule from '../accounts/account.module';
import AuthService from './services/auth.service';
import RegisterController from './controllers/register.controller';
import ConfigModule from '../../config/config.module';
import AuthController from './controllers/auth.controller';
import CookieStrategy from './strategies/cookie.strategy';
import RegisterService from './services/register.service';
import ServicesModule from '../master/services/services.module';
import RoleModule from '../master/roles/role.module';
import AuthCandidateController from './controllers/auth-candidate.controller';
import CaptchaController from './controllers/captcha.controller';

@Module({
  imports: [
    ConfigModule,
    AccountModule,
    RoleModule,
    ServicesModule,
    PassportModule.register({defaultStrategy: 'cookie', property: 'account', session: false}),
  ],
  exports: [ AuthService, RegisterService, CookieStrategy ],
  providers: [ AuthService, RegisterService, CookieStrategy ],
  controllers: [ AuthController, RegisterController, AuthCandidateController, CaptchaController ],
})
export default class AuthModule {}
