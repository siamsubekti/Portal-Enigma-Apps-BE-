import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/config/app.config';

@Injectable()
export default class MailerUtil {
  constructor(private readonly config: AppConfig) {}
}
