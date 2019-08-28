import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Like } from 'typeorm';
import { AccountQueryDTO, AccountQueryResult } from '../../../api/accounts/models/account.dto';
import { AccountType } from '../../../config/constants';
import Account from '../../../api/accounts/models/account.entity';
import DocumentService from '../../../api/resumes/document/services/document.service';
import Document from '../../../api/resumes/document/models/document.entity';
import * as moment from 'moment';

@Injectable()
export default class CandidateService {
  constructor(
    @InjectRepository(Account)
    private readonly candidate: Repository<Account>,
    private readonly docService: DocumentService,
  ) { }

  async find(id: string): Promise<Account> {
    return this.candidate.findOne(id);
  }

  async getCandidates(queryParams: AccountQueryDTO): Promise<AccountQueryResult<Account[]>> {
    const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * (queryParams.page - 1)) : 0;
    const orderCols: { [key: string]: string } = {
      username: 'a.username',
      fullname: 'p.fullname',
      nickname: 'p.nickname',
    };
    const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
    const query: SelectQueryBuilder<Account> = this.candidate.createQueryBuilder('a')
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

    query.where('a.account_type = :type', { type: AccountType.CANDIDATE });
    query.orderBy(queryParams.order ? orderCols[queryParams.order] : orderCols.fullname, sort);
    query.offset(offset);
    query.limit(queryParams.rowsPerPage);

    const result: [Account[], number] = await query.getManyAndCount();

    return {
      result: result[0],
      totalRows: result[1],
    };
  }

  async getRegisteredCandidate(): Promise<Account[]> {

    const registeredCandidate: Account[] = [];
    let candidate: Account;
    const accounts: Account[] = await this.candidate.find({ where: { createdAt: Like(`%${moment().format('YYYY-MM-DD')}%`) } });

    for (const account of accounts) {
      const doc: Document[] = await this.docService.findByAccountId(account.id);
      if (doc[0] !== (null || undefined)) {
        candidate = await this.candidate.findOne({ where: { id: account.id } });
        if (candidate) registeredCandidate.push(candidate);
      }
    }

    return registeredCandidate;
  }

}
