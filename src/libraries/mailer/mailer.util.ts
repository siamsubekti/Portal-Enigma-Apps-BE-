import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import AppConfig from '../../config/app.config';
import { EmailMessage } from './email-message.model';

@Injectable()
export default class MailerUtil {
  private readonly mailer: any;
  constructor(private readonly config: AppConfig) {
    this.mailer = nodemailer.createTransport({
      service: this.config.get('MAIL_SERVICE'),
      auth: {
        user: this.config.get('MAIL_USERNAME'),
        pass: this.config.get('MAIL_PASSWORD'),
      },
    });
  }

  async send(message: EmailMessage): Promise<any> {
    const response: any = await this.mailer.sendMail(message);

    Logger.debug(response);

    return response;
  }
}
