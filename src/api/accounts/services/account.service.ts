import * as moment from 'moment-timezone';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AccountQueryDTO, AccountQueryResult, AccountProfileDTO, AccountPrivilege } from '../models/account.dto';
import { AccountStatus } from '../../../config/constants';
import Account from '../models/account.entity';
import Profile from '../models/profile.entity';
import Role from '../../master/roles/models/role.entity';

@Injectable()
export default class AccountService {
  constructor( @InjectRepository(Account) private readonly account: Repository<Account> ) {}

  repository(): Repository<Account> {
    return this.account;
  }

  async all(queryParams: AccountQueryDTO): Promise<AccountQueryResult> {
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
        .orWhere('p.phone LIKE :term', { term })
        .where('a.status = :status', { status: AccountStatus.ACTIVE });
    }

    query.orderBy( queryParams.order ? orderCols[ queryParams.order ] : orderCols.fullname, sort );
    query.offset( queryParams.page > 1 ? ( queryParams.rowsPerPage * queryParams.page ) + 1 : 0 );
    query.limit( queryParams.rowsPerPage );

    const result: [ Account[], number ] = await query.getManyAndCount();
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

  async buildAccountPrivileges(id: string): Promise<AccountPrivilege> {
    const account: Account = await this.get(id);

    if (!account) return undefined;

    const privileges: AccountPrivilege = {
      roles: [],
      menus: [],
      services: [],
    };

    for (const role of await account.roles) {
      privileges.roles.push(role);
      privileges.menus.push( ...(await Object.create(role).menus) );
      privileges.services.push( ...(await Object.create(role).services) );
    }

    return privileges;
  }

  async setStatus(id: string, status: AccountStatus): Promise<Account> {
    const account: Account = await this.account.findOne(id);
    account.status = status;
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
}
