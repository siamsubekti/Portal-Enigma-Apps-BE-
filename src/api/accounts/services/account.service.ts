import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Account from '../models/account.entity';
import { AccountStatus } from '../../../config/constants';

@Injectable()
export default class AccountService {
  constructor(@InjectRepository(Account) private readonly account: Repository<Account>) {}

  repository(): Repository<Account> {
    return this.account;
  }

  async countByUsername(username: string): Promise<number> {
    return this.account.count({ where: { username, status: AccountStatus.ACTIVE } });
  }

  async findByUsername(username: string): Promise<Account> {
    return this.account.findOne({ where: { username, status: AccountStatus.ACTIVE }, relations: [ 'profile' ] });
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
