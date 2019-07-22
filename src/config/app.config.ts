import * as dotenv from 'dotenv';
import * as root from 'app-root-dir';
import * as md5 from 'md5';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import { RedisModuleOptions } from 'nestjs-redis';
import { Logger, Injectable } from '@nestjs/common';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import { existsSync, readFileSync } from 'fs';

@Injectable()
export default class AppConfig {
  private readonly configurations: dotenv.DotenvParseOutput;
  private readonly packageJson: { [key: string]: string };

  constructor() {
    this.configurations = this.configure();
    this.packageJson = require(join(root.get(), 'package.json'));
  }

  private configure(): dotenv.DotenvParseOutput {
    const { parsed: config, error} = dotenv.config();
    const saltbae: string = bcrypt.genSaltSync(Number(config['HASH_SALTROUNDS']));

    if (error) throw new Error(`Unable to load environment variables from the root of app directory.`);

    process.env.HASH_SECRET = config['HASH_SECRET'] = bcrypt.hashSync(md5(`${config['HASH_KEY']}x${moment().valueOf()}`), saltbae);
    process.env.BASE_PATH = config['BASE_PATH'] = root.get();
    process.env.SRC_PATH = config['SRC_PATH'] = join(root.get(), 'src');
    process.env.SSL_KEY = config['SSL_KEY'] = join(root.get(), config['SSL_KEY']);
    process.env.SSL_CERT = config['SSL_CERT'] = join(root.get(), config['SSL_CERT']);

    Logger.log(`${Object.keys(config).length} configuration items loaded.`, 'AppConfig', true);
    // Logger.debug(`SECRET: ${config['HASH_SECRET']}`, 'AppConfig', true);
    // Logger.debug(JSON.stringify(config), 'AppConfig', true);

    return config;
  }

  get(key: string): string {
    return process.env[ key ] || this.configurations[ key ] || null;
  }

  getPackageInfo(key: string): string {
    return this.packageJson ? this.packageJson[ key ] || null : '';
  }

  redis(): RedisModuleOptions {
    const options: RedisModuleOptions = {
      host: this.get('REDIS_HOST'),
      port: Number(this.get('REDIS_PORT')),
      db: Number(this.get('REDIS_DB')),
    };

    if (this.get('REDIS_PASSWORD') !== '') options.password = this.get('REDIS_PASSWORD');

    return options;
  }

  serverOptions(): NestApplicationOptions {
    if (process.env.NODE_ENV === 'local' && existsSync(this.get('SSL_KEY')) && existsSync(this.get('SSL_CERT')))
      return {
        httpsOptions: {
          key: readFileSync(this.get('SSL_KEY')),
          cert: readFileSync(this.get('SSL_CERT')),
        },
      };
    else return undefined;
  }

  viewEngine(): {viewPath: string, partialsDir: string, layoutsDir: string, extname: string} {
    return {
      viewPath: `${this.get('SRC_PATH')}/views`,
      partialsDir: `${this.get('SRC_PATH')}/views`,
      layoutsDir: `${this.get('SRC_PATH')}/views`,
      extname: '.hbs',
    };
  }
}
