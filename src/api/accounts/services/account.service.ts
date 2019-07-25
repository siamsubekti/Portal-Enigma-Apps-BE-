import * as moment from 'moment-timezone';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AccountQueryDTO, AccountQueryResult, AccountProfileDTO } from '../models/account.dto';
import { AccountStatus } from '../../../config/constants';
import AppConfig from '../../../config/app.config';
import Account from '../models/account.entity';
import Profile from '../models/profile.entity';

@Injectable()
export default class AccountService {
  constructor(
    private readonly config: AppConfig,
    @InjectRepository(Account) private readonly account: Repository<Account>,
  ) {}

  repository(): Repository<Account> {
    return this.account;
  }

  async all(queryParams: AccountQueryDTO): Promise<AccountQueryResult> {
    let query: SelectQueryBuilder<Account> = this.account.createQueryBuilder('a')
      .leftJoinAndSelect('a.profile', 'p');

    if (queryParams.term) {
      let { term } = queryParams;
      term = `%${term}%`;
      query = query
        .orWhere('a.username LIKE :term', { term })
        .orWhere('a.status LIKE :term', { term })
        .orWhere('p.fullname LIKE :term', { term })
        .orWhere('p.nickname LIKE :term', { term })
        .orWhere('p.phone LIKE :term', { term });
    }

    if (queryParams.order && queryParams.sort) {
      const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
      const orderCols: { [key: string]: string } = {
        username: 'a.username',
        fullname: 'p.fullname',
        nickname: 'p.nickname',
      };

      query = query.orderBy( orderCols[ queryParams.order ], sort );
    } else
      query = query.orderBy( 'p.fullname', 'ASC' );

    query.offset( queryParams.page > 1 ? ( queryParams.rowsPerPage * queryParams.page ) + 1 : 0 );
    query.limit( queryParams.rowsPerPage );

    const result: [ Account[], number ] = await query.getManyAndCount();
    Logger.log(queryParams, 'AccountService@all', true);

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
    profile.birthdate = moment(`${data.birthdate} 00:00:00`, 'DD-MM-YYYY HH:mm:ss').toDate();
    profile.gender = data.gender;
    profile.religion = data.religion;
    profile.maritalStatus = data.maritalStatus;

    account.username = data.username;
    account.profile = profile;

    return account;
  }

  async countByUsername(username: string): Promise<number> {
    return this.account.count({ where: { username, status: AccountStatus.ACTIVE } });
  }

  async findByUsername(username: string): Promise<Account> {
    return this.account.findOne({ select: [ 'id', 'username', 'password', 'status' ], where: { username, status: AccountStatus.ACTIVE }, relations: [ 'profile' ] });
  }

  async get(id: string): Promise<Account> {
    return this.account.findOne(id, { where: { status: AccountStatus.ACTIVE }, relations: [ 'profile' ] });
  }

  async suspend(id: string): Promise<Account> {
    const account: Account = await this.account.findOne(id);
    account.status = AccountStatus.SUSPENDED;
    account.updatedAt = new Date();

    return await this.save(account);
  }

  async resetPassword(id: string, password: string): Promise<Account> {
    const account: Account = await this.account.findOne(id);
    account.password = password;
    account.status = AccountStatus.ACTIVE;
    account.updatedAt = new Date();

    return await this.save(account);
  }

  async save(account: Account): Promise<Account> {
    return this.account.save(account);
  }
}
