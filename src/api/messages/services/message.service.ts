import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AccountType } from '../../../config/constants';
import { ContactFormDTO, MessageQueryParams } from '../models/message.dto';
import Message from '../models/message.entity';
import Account from '../../accounts/models/account.entity';
import AccountService from '../../accounts/services/account.service';
import TemplateUtil from '../../../libraries/utilities/template.util';
import MailerUtil from '../../../libraries/mailer/mailer.util';
import AppConfig from '../../../config/app.config';

@Injectable()
export default class MessageService {
  constructor(
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    private readonly accountService: AccountService,
    private readonly templateUtil: TemplateUtil,
    private readonly mailUtil: MailerUtil,
    private readonly config: AppConfig,
  ) {}

  get repository(): Repository<Message> {
    return this.messageRepository;
  }

  async count(term?: string): Promise<number> {
    const query: SelectQueryBuilder<Message> = this.messageRepository.createQueryBuilder('m');

    if (term) {
      term = `%${term}%`;

      query.orWhere('m.email LIKE :term', { term });
      query.orWhere('m.fullname LIKE :term', { term });
      query.orWhere('m.subject LIKE :term', { term });
      query.orWhere('m.content LIKE :term', { term });
    }

    return await query.getCount();
  }

  async all(queryParams: MessageQueryParams): Promise<Message[]> {
    const offset: number = queryParams.page > 1 ? ( queryParams.rowsPerPage * ( queryParams.page - 1 ) ) : 0;
    const order: string = `m.${queryParams.order}`;
    const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';

    const query: SelectQueryBuilder<Message> = this.messageRepository.createQueryBuilder('m');

    if (queryParams.term) {
      let { term } = queryParams;
      term = `%${term}%`;

      query.orWhere('m.email LIKE :term', { term });
      query.orWhere('m.fullname LIKE :term', { term });
      query.orWhere('m.subject LIKE :term', { term });
      query.orWhere('m.content LIKE :term', { term });
    }

    query.orderBy(order, sort);
    query.offset(offset);
    query.limit(queryParams.rowsPerPage);

    return await query.getMany();
  }

  async find(id: number): Promise<Message> {
    return this.messageRepository.findOne(id);
  }

  async update(data: Message): Promise<Message> {
    return this.messageRepository.save(data);
  }

  async create(data: ContactFormDTO): Promise<Message> {
    let message: Message = this.messageRepository.create(data);

    message = await this.messageRepository.save(message);

    if (message.createdAt) this.sendNotificationEmail(message);

    return message;
  }

  private async sendNotificationEmail(message: Message): Promise<void> {
    const recipients: Account[] = await this.accountService.findByAccountType(AccountType.ADMINISTRATOR, AccountType.STAFF);

    try {
      if (recipients.length > 0) for (const recipient of recipients) {
        const { profile: { email: to, fullname: name } } = recipient;
        const { fullname: sender, subject, content } = message;
        const html: string = await this.templateUtil.renderToString(
          'message/notification.mail.hbs',
          { sender, subject, content, name, baseUrl: this.config.get('FRONTEND_PORTAL_URL')},
        );

        const response: any = await this.mailUtil.send({
          from: this.config.get('MAIL_SENDER'),
          to: `${name}<${to}>`,
          subject,
          html,
        });

        Logger.log(response);
      }
    } catch (exception) {
      Logger.error('NOTIFICATION EMAIL FAILURE.', undefined, 'MessageService@sendNotificationEmail', true);
      console.error(exception);
    }
  }
}
