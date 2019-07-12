import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Account from '../models/account.entity';

@Injectable()
export default class AccountService {
  constructor(@InjectRepository(Account) private readonly account: Repository<Account>) {}

  repository(): Repository<Account> {
    return this.account;
  }

  async findByUsername(username: string): Promise<Account> {
    return this.account.findOne({ username });
  }

  async get(id: string): Promise<Account> {
    return this.account.findOne(id);
  }

  async save(account: Account): Promise<Account> {
    return this.account.save(account);
  }
}
