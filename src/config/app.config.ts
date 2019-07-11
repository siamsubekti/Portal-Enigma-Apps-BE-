
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as root from 'app-root-dir';
import * as md5 from 'md5';
import * as moment from 'moment';
import { RedisModuleOptions } from 'nestjs-redis';

export class AppConfig {
  private readonly configurations: dotenv.DotenvParseOutput;
  private readonly packageJson: { [key: string]: string };

  constructor() {
    this.configurations = this.configure();
    this.packageJson = require(path.join(root.get(), 'package.json'));
  }

  private configure(): dotenv.DotenvParseOutput {
    const { parsed: config, error} = dotenv.config();

    if (error) throw new Error(`Unable to load environment variables from the root of app directory.`);

    config['BASE_PATH'] = root.get();
    config['SRC_PATH'] = path.join(root.get(), 'src');
    config['HASH_SECRET'] = md5(`${config['HASH_KEY']}x${moment().valueOf()}`);

    return config;
  }

  get(key: string): string {
    return this.configurations[ key ] || null;
  }

  getPackageInfo(key: string): string {
    return this.packageJson ? this.packageJson[ key ] || null : '';
  }

  redis(): RedisModuleOptions {
    const options: RedisModuleOptions = {
      host: this.configurations['REDIS_HOST'],
      port: Number(this.configurations['REDIS_PORT']),
      db: Number(this.configurations['REDIS_DB']),
    };

    if (this.configurations['REDIS_PASSWORD'] !== '') options.password = this.configurations['REDIS_PASSWORD'];

    return options;
  }
}
