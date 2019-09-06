import * as moment from 'moment-timezone';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Like } from 'typeorm';
import { AccountType } from '../../../config/constants';
import { AccountQueryResult, AccountProfileDTO } from '../../../api/accounts/models/account.dto';
import { CandidateQueryDTO } from '../models/candidate.dto';
import ValidatorUtil from '../../../libraries/utilities/validator.util';
import Account from '../../../api/accounts/models/account.entity';
import Document from '../../../api/resumes/document/models/document.entity';
import DocumentService from '../../../api/resumes/document/services/document.service';

@Injectable()
export default class CandidateService {
  constructor(
    @InjectRepository(Account)
    private readonly candidate: Repository<Account>,
    private readonly docService: DocumentService,
    private readonly validatorUtil: ValidatorUtil,
  ) { }

  async find(id: string): Promise<Account> {
    return this.candidate.findOne(id);
  }

  async getCandidates(queryParams: CandidateQueryDTO): Promise<AccountQueryResult<Account[]>> {
    const { startDate, endDate } = queryParams;
    const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * (queryParams.page - 1)) : 0;
    const orderCols: { [key: string]: string } = {
      fullname: 'p.fullname',
      email: 'p.email',
      birthdate: 'p.birthdate',
      age: 'age',
    };
    const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
    const query: SelectQueryBuilder<Account> = this.candidate.createQueryBuilder('a')
      .innerJoinAndSelect('a.profile', 'p');

    query.addSelect('YEAR(CURDATE()) - YEAR(p.birthdate)', 'age');
    if (queryParams.term) {
      let { term } = queryParams;
      term = `%${term}%`;
      query
        .orWhere('a.username LIKE :term', { term })
        .orWhere('p.fullname LIKE :term', { term })
        .orWhere('p.phone LIKE :term', { term })
        .orWhere('p.email LIKE :term', { term });
    }

    if (startDate && startDate.isValid() && !endDate) {
      query.andWhere('DATE(a.created_at) = :startDate', { startDate: startDate.format('YYYY-MM-DD') });
      Logger.log(`start date only ${startDate.toDate()}`);
    } else if (startDate && endDate && this.validatorUtil.validateDateBetween(startDate, endDate)) {
      query.andWhere('DATE(a.created_at) BETWEEN :startDate AND :endDate', { startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD') });
      Logger.log(`start date (${startDate.toDate()}) between end date (${endDate.toDate()})`);
    } else if (startDate && endDate && !this.validatorUtil.validateDateBetween(startDate, endDate))
      throw new BadRequestException('Validation failed for start and end date range, end date cannot be earlier than start date, both date range must be a valid date.');

    query.andWhere('a.account_type = :type', { type: AccountType.CANDIDATE });
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

  async update(candidate: Account, form: AccountProfileDTO): Promise<Account> {
    const { profile } = candidate;

    profile.fullname = form.fullname;
    profile.nickname = form.nickname;
    profile.email = form.email;
    profile.phone = form.phone;
    profile.birthdate = form.birthdate;
    profile.gender = form.gender;
    profile.religion = form.religion;
    profile.maritalStatus = form.maritalStatus;

    candidate.username = form.email;
    candidate.profile = profile;

    return await this.candidate.save(candidate);
  }

}
