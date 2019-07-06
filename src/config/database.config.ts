import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from './app.config';

@Injectable()
export class DatabaseConnectionConfig implements TypeOrmOptionsFactory {
  constructor(private readonly config: AppConfig) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const driver: any = this.config.get('DB_DRIVER');
    const options: TypeOrmModuleOptions = {
      type: driver,
      host: this.config.get('DB_HOST'),
      port: Number(this.config.get('DB_PORT')),
      username: this.config.get('DB_USERNAME'),
      password: this.config.get('DB_PASSWORD'),
      database: this.config.get('DB_NAME'),
      entities: [
        this.config.get('SRC_PATH') + '/**/*.entity{.ts,.js}',
        this.config.get('SRC_PATH') + '/**/*.model{.ts,.js}',
      ],
      synchronize: (this.config.get('DB_SYNC') === 'true'),
    };

    return options;
  }
}
