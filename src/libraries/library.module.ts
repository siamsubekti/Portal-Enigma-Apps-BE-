import { Module, Global } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { AppConfig } from '../config/app.config';
import ConfigModule from 'src/config/config.module';
import HashUtil from './utilities/hash.util';
import ResponseUtil from './responses/response.util';

@Global()
@Module({
  imports: [
    ConfigModule,
    RedisModule.forRootAsync({
      useFactory: (config: AppConfig) => config.redis(),
      inject: [AppConfig],
      imports: [ConfigModule],
    }),
  ],
  exports: [HashUtil, ResponseUtil],
  providers: [HashUtil, ResponseUtil],
})
export default class LibraryModule { }
