import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import AppConfig from './app.config';

@Injectable()
export default class DatabaseConnectionConfig implements TypeOrmOptionsFactory {
  constructor(private readonly config: AppConfig) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const driver: any = this.config.get('DB_DRIVER');
    const options: TypeOrmModuleOptions = {
      name: driver,
      type: driver,
      host: this.config.get('DB_HOST'),
      port: Number(this.config.get('DB_PORT')),
      username: this.config.get('DB_USERNAME'),
      password: this.config.get('DB_PASSWORD'),
      database: this.config.get('DB_NAME'),
      entities: [
        `${__dirname}/../**/*.entity{.ts,.js}`,
        `${__dirname}/../**/*.model{.ts,.js}`,
      ],
      synchronize: (this.config.get('DB_SYNC') === 'true'),
      logging: (this.config.get('NODE_ENV') === 'local'),
    };

    return options;
  }
}
