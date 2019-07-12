import { Module } from '@nestjs/common';
import AccountModule from '../accounts/account.module';
import AuthService from './services/auth.service';
import RegisterController from './controllers/register.controller';
import ConfigModule from '../../config/config.module';
import AuthController from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import CookieStrategy from './strategies/cookie.strategy';

@Module({
  imports: [
    ConfigModule,
    AccountModule,
    PassportModule.register({defaultStrategy: 'cookie', property: 'account', session: false}),
  ],
  exports: [ AuthService, CookieStrategy ],
  providers: [ AuthService, CookieStrategy ],
  controllers: [ AuthController, RegisterController ],
})
export default class AuthModule {}
