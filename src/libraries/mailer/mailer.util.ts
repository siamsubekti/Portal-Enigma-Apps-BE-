import * as nodemailer from 'nodemailer';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfig } from '../../config/app.config';
import { EmailMessage } from './email-message.model';

@Injectable()
export default class MailerUtil {
  private readonly mailer: any;
  constructor(private readonly config: AppConfig) {
    this.mailer = nodemailer.createTransport({
      service: config.get('MAIL_SERVICE'),
      auth: {
        user: config.get('MAIL_USERNAME'),
        pass: config.get('MAIL_PASSWORD'),
      },
    });
  }

  async send(message: EmailMessage): Promise<any> {
    const response: any = await this.mailer.sendMail(message);

    Logger.log(response);

    return response;
  }
}
