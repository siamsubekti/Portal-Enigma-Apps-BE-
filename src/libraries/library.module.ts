import { Module, Global } from '@nestjs/common';
import { RedisModule, RedisModuleOptions } from 'nestjs-redis';
import AppConfig from '../config/app.config';
import ConfigModule from '../config/config.module';
import ResponseUtil from './responses/response.util';
import HashUtil from './utilities/hash.util';
import MailerUtil from './mailer/mailer.util';
import TemplateUtil from './utilities/template.util';

@Global()
@Module({
  imports: [
    ConfigModule,
    RedisModule.forRootAsync({
      useFactory: (config: AppConfig): RedisModuleOptions => config.redis(),
      inject: [AppConfig],
      imports: [ConfigModule],
    }),
  ],
  exports: [HashUtil, MailerUtil, ResponseUtil, TemplateUtil],
  providers: [HashUtil, MailerUtil, ResponseUtil, TemplateUtil],
})
export default class LibraryModule { }
