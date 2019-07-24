import { Controller, UseGuards, Get, Put, Delete, Query } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiImplicitQuery, ApiOkResponse, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { PagingData } from '../../../libraries/responses/response.class';
import { ApiPagedResponse, ApiExceptionResponse } from '../../../libraries/responses/response.type';
import { AccountResponse } from '../models/account.dto';
import AccountService from '../services/account.service';
import AppConfig from '../../../config/app.config';
import CookieAuthGuard from '../../auth/guards/cookie.guard';

@Controller('accounts')
@ApiUseTags('Accounts')
@UseGuards(CookieAuthGuard)
export default class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly config: AppConfig,
  ) {}

  @Get()
  @ApiOperation({ title: 'List of User Accounts.', description: 'Get list of registered user accounts from database.'})
  @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
  @ApiImplicitQuery({ name: 'order', description: 'Order columns (username, fullname, or nickname)', type: ['username', 'fullname', 'nickname'], required: false })
  @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
  @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
  @ApiOkResponse({ description: 'List of user accounts.', type: ApiPagedResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async all(
    @Query('term') term?: string,
    @Query('order') order: 'username' | 'fullname' | 'nickname' = 'fullname',
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
    @Query('page') page: number = 1,
  ): Promise<AccountResponse> {
    const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
    const { result: data = [], totalRows } = await this.accountService.all({ term, order, sort, page, rowsPerPage });
    const paging: PagingData = {
      page,
      rowsPerPage,
      totalPages: Math.ceil( totalRows / rowsPerPage ),
      totalRows,
    };

    return { data, paging };
  }

  // @Get(':id')
  // async get(): Promise<AccountResponse> {}

  // @Put(':id')
  // async edit(): Promise<AccountResponse> {}

  // @Delete(':id')
  // async delete(): Promise<void> {}

  // @Put('status/:id')
  // async suspend(): Promise<void> {}

  // @Put('status/:id')
  // async blacklist(): Promise<void> {}
}
