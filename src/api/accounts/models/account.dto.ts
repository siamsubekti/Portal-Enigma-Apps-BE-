import { ResponseStatus, PagingData } from '../../../libraries/responses/response.class';
import Account from './account.entity';

export class AccountResponse {
  status?: ResponseStatus;
  data: Account | Account[];
  paging?: PagingData;
}

export class AccountDTO {
  username: string;
  password: string;
  confirmPassword: string;
  status: 'INACTIVE' | 'ACTIVE' | 'SUSPENDED' | 'BLACKLISTED';
  createdAt: Date;
  updatedAt: Date;
}

export class AccountQueryDTO {
  term?: string;
  order?: 'username' | 'fullname' | 'nickname';
  sort?: 'asc' | 'desc';
  page?: number;
  rowsPerPage?: number;
}

export class AccountQueryResult {
  result: Account[] | Account;
  totalRows: number;
}
