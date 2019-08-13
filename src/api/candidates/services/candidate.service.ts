import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Account from '../../../api/accounts/models/account.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AccountQueryDTO, AccountQueryResult } from '../../../api/accounts/models/account.dto';
import { AccountType } from '../../../config/constants';

@Injectable()
export default class CandidateService {
    constructor(@InjectRepository(Account)
    private readonly candidate: Repository<Account>) { }

    async getCandidates(queryParams: AccountQueryDTO): Promise<AccountQueryResult<Account[]>> {
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
            .orWhere('p.phone LIKE :term', { term })
        }

        query.orderBy(queryParams.order ? orderCols[queryParams.order] : orderCols.fullname, sort);
        query.offset(queryParams.page > 1 ? (queryParams.rowsPerPage * queryParams.page) + 1 : 0);
        query.limit(queryParams.rowsPerPage);

        const result: [Account[], number] = await query.getManyAndCount();
        Logger.log(queryParams, 'getCandidate@all', true);

        const candidates = result[0].filter(function(value, index, arr) {
          return value.accountType === AccountType.CANDIDATE;
        })

        return {
          result: candidates,
          totalRows: result[1],
        };
      }

      async searchCandidates(queryParams: AccountQueryDTO): Promise<AccountQueryResult<Account[]>> {
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
            .orWhere('p.phone LIKE :term', { term })
        }

        query.orderBy(queryParams.order ? orderCols[queryParams.order] : orderCols.fullname, sort);
        query.limit(queryParams.rowsPerPage);

        const result: [Account[], number] = await query.getManyAndCount();
        Logger.log(queryParams, 'getCandidate@all', true);

        const candidates = result[0].filter(function(value, index, arr) {
          return value.accountType === AccountType.CANDIDATE;
        })

        return {
          result: candidates,
          totalRows: result[1],
        };
      }

}