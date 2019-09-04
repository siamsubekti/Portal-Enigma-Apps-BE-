import * as moment from 'moment-timezone';
import { Injectable, Logger, HttpException, HttpStatus, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, In, Not } from 'typeorm';
import { AccountQueryDTO, AccountQueryResult, AccountProfileDTO, AccountPrivilege } from '../models/account.dto';
import { AccountStatus, AccountType } from '../../../config/constants';
import Account from '../models/account.entity';
import Profile from '../models/profile.entity';
import ProfileService from './profile.service';
import Role from '../../master/roles/models/role.entity';
import RoleService from '../../../api/master/roles/services/role.service';
import MenuService from '../../../api/master/menus/services/menu.service';
import HashUtil from '../../../libraries/utilities/hash.util';
import TemplateUtil from '../../../libraries/utilities/template.util';
import MailerUtil from '../../../libraries/mailer/mailer.util';
import AppConfig from '../../../config/app.config';

@Injectable()
export default class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly account: Repository<Account>,
    private readonly roleServices: RoleService,
    private readonly profilService: ProfileService,
    private readonly menuService: MenuService,
    private readonly hashUtil: HashUtil,
    private readonly mailUtil: MailerUtil,
    private readonly templateUtil: TemplateUtil,
    private readonly config: AppConfig,
  ) { }

  repository(): Repository<Account> {
    return this.account;
  }

  async all(queryParams: AccountQueryDTO): Promise<AccountQueryResult<Account[]>> {
    const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * (queryParams.page - 1)) : 0;
    const orderCols: { [key: string]: string } = {
      username: 'a.username',
      fullname: 'p.fullname',
      nickname: 'p.nickname',
    };
    const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
    const query: SelectQueryBuilder<Account> = this.account.createQueryBuilder('a')
      .innerJoinAndSelect('a.profile', 'p');

    if (queryParams.term) {
      let { term } = queryParams;
      term = `%${term}%`;
      query
        .orWhere('a.username LIKE :term', { term })
        .orWhere('a.status LIKE :term', { term })
        .orWhere('p.fullname LIKE :term', { term })
        .orWhere('p.nickname LIKE :term', { term })
        .orWhere('p.phone LIKE :term', { term });
    }
    query.where('a.status = :status', { status: AccountStatus.ACTIVE });
    query.orderBy(queryParams.order ? orderCols[queryParams.order] : orderCols.fullname, sort);
    query.offset(offset);
    query.limit(queryParams.rowsPerPage);

    const result: [Account[], number] = await query.getManyAndCount();
    // Logger.log(queryParams, 'AccountService@all', true);

    return {
      result: result[0],
      totalRows: result[1],
    };
  }

  async update(id: string, data: AccountProfileDTO): Promise<Account> {
    const account: Account = await this.get(id);
    if (!account) throw new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: `Account not found with ID ${id}`,
      }, 404);

    const profile: Profile = account.profile;
    profile.fullname = data.fullname;
    profile.nickname = data.nickname || data.fullname.substring(0, data.fullname.indexOf(' '));
    profile.email = data.email;
    profile.phone = data.phone;
    profile.birthdate = moment(data.birthdate, 'DD-MM-YYYY').toDate();
    profile.gender = data.gender;
    profile.religion = data.religion;
    profile.maritalStatus = data.maritalStatus;

    account.username = data.username;
    account.profile = profile;

    const roles: Role[] = await this.roleServices.findAllRelated(data.roles);
    account.roles = Promise.resolve(roles);

    return await this.account.save(account);
  }

  async countByEmail(email: string, candidate: boolean = false): Promise<number> {
    const query: SelectQueryBuilder<Account> = this.account.createQueryBuilder('a')
      .innerJoinAndSelect('a.profile', 'p');

    query.where('p.email = :email', { email });
    query.where('a.account_type = :type', { type: (candidate ? AccountType.CANDIDATE : Not(AccountType.CANDIDATE)) });
    query.where('a.status = :status', { status: AccountStatus.ACTIVE });

    return query.getCount();
  }

  async findByEmail(email: string, candidate: boolean = false): Promise<Account> {
    const query: SelectQueryBuilder<Account> = this.account.createQueryBuilder('a')
      .innerJoinAndSelect('a.profile', 'p');

    query.where('p.email = :email', { email });

    if (candidate)
      query.andWhere('a.account_type = :accountType', { accountType: AccountType.CANDIDATE });
    else
      query.andWhere('a.account_type != :accountType', { accountType: AccountType.CANDIDATE });

    query.andWhere('a.status = :status', { status: AccountStatus.ACTIVE });
    query.limit(1);

    return query.getOne();
  }

  async countByUsername(username: string, candidate: boolean = false): Promise<number> {
    return this.account.count({
      where: {
        username,
        accountType: (candidate ? AccountType.CANDIDATE : Not(AccountType.CANDIDATE)),
        status: AccountStatus.ACTIVE,
      },
    });
  }

  async findByUsername(username: string, candidate: boolean = false): Promise<Account> {
    return this.account.findOne({
      select: ['id', 'username', 'password', 'status', 'lastlogin', 'accountType'],
      where: {
        username,
        accountType: (candidate ? AccountType.CANDIDATE : Not(AccountType.CANDIDATE)),
        status: AccountStatus.ACTIVE,
      },
      relations: ['profile'],
    });
  }

  async findByAccountType(...accountTypes: AccountType[]): Promise<Account[]> {
    return this.account.find({ where: { accountType: In(accountTypes) }, relations: ['profile'] });
  }

  async findSuspendedAccount(username: string): Promise<Account> {
    return this.account.findOne({ select: ['id', 'username', 'password', 'status', 'lastlogin', 'accountType'], where: { username, status: AccountStatus.SUSPENDED }, relations: ['profile'] });
  }

  async get(id: string): Promise<Account> {
    return this.account.findOne(id, { where: { status: AccountStatus.ACTIVE }, relations: ['profile'] });
  }

  async buildAccountPrivileges(id: string): Promise<AccountPrivilege> {
    const account: Account = await this.get(id);

    if (!account) return undefined;

    const privileges: AccountPrivilege = {
      account,
      roles: [],
      menus: [],
      services: [],
    };

    for (const role of await (Object.create(account).roles)) {
      privileges.roles.push(role);
      privileges.services.push(...(await Object.create(role).services));

      for (let menu of (await Object.create(role).menus)) {
        menu = await this.menuService.getWithParent(menu.id);
        privileges.menus.push(menu);
      }
    }

    return privileges;
  }

  async setStatus(id: string, status: AccountStatus): Promise<Account> {
    const account: Account = await this.account.findOne(id);
    account.status = status;
    account.updatedAt = new Date();

    return await this.save(account);
  }

  async deactive(id: string): Promise<Account> {
    const account: Account = await this.account.findOne(id);
    if (!account) throw new NotFoundException('Account not found.');
    else {
      account.status = AccountStatus.INACTIVE;
      account.roles = Promise.resolve([]);
      account.updatedAt = new Date();

      return await this.save(account);
    }
  }

  async resetPassword(id: string, password: string): Promise<Account> {
    const account: Account = await this.account.findOne(id);
    account.password = password;
    account.status = AccountStatus.ACTIVE;
    account.updatedAt = new Date();

    return await this.save(account);
  }

  async cleanDelete(id: string): Promise<void> {
    try {
      const account: Account = await this.account.findOneOrFail(id);

      await this.account.delete(account);
    } catch (error) {
      Logger.log(error);

      throw error;
    }
  }

  async save(account: Account): Promise<Account> {
    return this.account.save(account);
  }

  async create(accountDto: AccountProfileDTO): Promise<Account> {
    const usernameExist: boolean = await this.account.count({ where: { username: accountDto.username } }) > 0;
    const nickName: Profile = await this.profilService.findNickname(accountDto.nickname);
    const email: Profile = await this.profilService.findMail(accountDto.email);

    if (usernameExist) throw new BadRequestException('Username has already been taken.');
    if (nickName) throw new BadRequestException('Nickname has already been taken.');
    if (email) throw new BadRequestException('Email has already been taken.');

    let profile: Profile = new Profile();
    profile.fullname = accountDto.fullname;
    profile.nickname = accountDto.nickname || accountDto.fullname.substring(0, accountDto.fullname.indexOf(' '));
    profile.email = accountDto.email;
    profile.phone = accountDto.phone;
    profile.birthdate = moment(accountDto.birthdate, 'DD-MM-YYYY').toDate();
    profile.gender = accountDto.gender;
    profile.religion = accountDto.religion;
    profile.maritalStatus = accountDto.maritalStatus;

    profile = await this.profilService.save(profile);

    let account: Account = new Account();
    account.username = accountDto.username;
    account.password = await this.hashUtil.create(process.env.DEFAULT_PASSWORD);
    account.profile = profile;
    account.status = AccountStatus.SUSPENDED;

    if (accountDto.roles) {
      const roles: Role[] = await this.roleServices.findAllRelated(accountDto.roles);
      account.roles = Promise.resolve(roles);
    }

    account = await this.account.save(account);

    this.sendAccountCreatedEmail(account);

    return account;
  }

  private async sendAccountCreatedEmail(account: Account): Promise<boolean> {
    try {
      const { username, profile: { fullname: name, email: to } } = account;
      const password: string = process.env.DEFAULT_PASSWORD;
      const html: string = await this.templateUtil.renderToString(
        'account/account-bo-created.mail.hbs',
        { name, username, password, baseUrl: this.config.get('API_BASE_URL') });

      const response: any = await this.mailUtil.send({
        from: this.config.get('MAIL_SENDER'),
        to: `${name}<${to}>`,
        subject: 'Enigma Portal Backoffice Account Activation',
        html,
      });

      if (response) Logger.log(`Candidate account activation email sent to ${to}.`);
      return (response ? true : false);
    } catch (exception) {
      Logger.error(exception, exception, 'AccountService@sendAccountCreatedEmail', true);

      return false;
    }
  }
}
