
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as root from 'app-root-dir';

export class AppConfig {
  private readonly configurations: dotenv.DotenvConfigOutput;
  private readonly packageJson: { [key: string]: string };

  constructor() {
    this.configurations = this.configure();
    this.packageJson = require(path.join(root.get(), 'package.json'));
  }

  private configure(): dotenv.DotenvConfigOutput {
    const { parsed: config, error} = dotenv.config();

    if (error) throw new Error(`Unable to load environment variables from the root of app directory.`);

    config['BASE_PATH'] = root.get();
    config['SRC_PATH'] = path.join(root.get(), 'src');

    return config;
  }

  get(key: string): string {
    return this.configurations[ key ] || null;
  }

  getPackageInfo(key: string): string {
    return this.packageJson ? this.packageJson[ key ] || null : '';
  }
}
