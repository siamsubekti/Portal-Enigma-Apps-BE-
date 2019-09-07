import * as captcha from 'svg-captcha';
import { Validator } from 'class-validator';
import { IORedis } from 'redis';
import { RedisService } from 'nestjs-redis';
import { Injectable } from '@nestjs/common';
import { CaptchaResponseDTO } from '../models/register.dto';
import HashUtil from '../../../libraries/utilities/hash.util';
import AppConfig from '../../../config/app.config';

@Injectable()
export default class CaptchaService {
  constructor(
    private readonly redisService: RedisService,
    private readonly hashUtil: HashUtil,
    private readonly config: AppConfig,
  ) {}

  async destroy(token: string): Promise<void> {
    const client: IORedis.Redis = this.redisService.getClient();
    await client.unlink(token);
  }

  async verify(token: string, answer: string): Promise<boolean> {
    const validator: Validator = new Validator();
    const client: IORedis.Redis = this.redisService.getClient();
    const dbToken: string = await client.get(token);
    const valid: boolean = ( await client.exists(token) && dbToken && validator.equals(answer, dbToken) );

    // Logger.log(`token: ${token}, answer: ${answer}, db: ${dbToken}, valid: ${valid}`);

    return valid;
  }

  async generate(): Promise<CaptchaResponseDTO> {
    const options: captcha.ConfigObject = { size: 5, noise: 5, color: true, background: '#fff', width: 320, height: 120 };
    const { data: image, text: answer } = await captcha.create(options);
    const token: string = await this.storeCaptchaData(answer);

    // Logger.log(`token: ${token}, answer: ${answer}`);
    return { token, image };
  }

  private async storeCaptchaData(answer: string): Promise<string> {
    const token: string = this.hashUtil.createRandomString();
    const expiresIn: number = Number(this.config.get('CAPTCHA_EXPIRES'));
    const client: IORedis.Redis = this.redisService.getClient();

    await client.set(token, answer);
    await client.expire(token, expiresIn);

    return token;
  }
}
