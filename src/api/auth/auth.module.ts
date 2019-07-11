import { Module } from '@nestjs/common';
import AccountModule from '../accounts/account.module';
import AuthService from './services/auth.service';
import RegisterController from './controllers/register.controller';
import ConfigModule from '../../config/config.module';
import AuthController from './controllers/auth.controller';

@Module({
  imports: [
    ConfigModule,
    AccountModule,
  ],
  exports: [ AuthService ],
  providers: [ AuthService ],
  controllers: [ AuthController, RegisterController ],
})
export default class AuthModule {}
