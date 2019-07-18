import { Module, Global } from '@nestjs/common';
import AppConfig from './app.config';
import DatabaseConnectionConfig from './database.config';

@Global()
@Module({
  providers: [
    {
      provide: AppConfig,
      useValue: new AppConfig(),
    },
    DatabaseConnectionConfig,
  ],
  exports: [ AppConfig, DatabaseConnectionConfig ],
})

export default class ConfigModule {}
