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

@Module({
  imports: [
    ConfigModule,
    AccountModule,
    ServicesModule,
    PassportModule.register({defaultStrategy: 'cookie', property: 'account', session: false}),
  ],
  exports: [ AuthService, RegisterService, CookieStrategy ],
  providers: [ AuthService, RegisterService, CookieStrategy ],
  controllers: [ AuthController, RegisterController ],
})
export default class AuthModule {}
