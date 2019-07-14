import * as md5 from 'md5';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { AppConfig } from '../../config/app.config';

@Injectable()
export default class HashUtil {
  constructor(private readonly config: AppConfig) {}

  async create(input: string): Promise<string> {
    const saltrounds: number = Number(this.config.get('HASH_SALTROUNDS'));
    const saltbae: string = await bcrypt.genSalt(saltrounds);

    return bcrypt.hash(input, saltbae);
  }

  async compare(input: string, hash: string): Promise<boolean> {
    return bcrypt.compare(input, hash);
  }

  createMd5Hash(input: string): string {
    return md5(input);
  }

  compareMd5Hash(input: string, hash: string): boolean {
    return (md5(input) === hash);
  }
}
