import { Module } from '@nestjs/common';
import { AppConfig } from './app.config';
import { DatabaseConnectionConfig } from './database.config';

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

export class ConfigModule {}
