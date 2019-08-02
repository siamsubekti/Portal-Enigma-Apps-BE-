import {
  ApiUseTags,
  ApiOperation,
  ApiImplicitQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiImplicitParam,
  ApiNotFoundResponse,
  ApiImplicitBody,
  ApiBadRequestResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { Controller, UseGuards, Get, Put, Query, Param, Body, Delete, UseInterceptors, HttpException, HttpStatus, Request } from '@nestjs/common';
import { PagingData } from '../../../libraries/responses/response.class';
import { ResponseRebuildInterceptor } from '../../../libraries/responses/response.interceptor';
import { ApiPagedResponse, ApiExceptionResponse, ApiResponse } from '../../../libraries/responses/response.type';
import { AccountResponse, AccountProfileDTO, AccountPrivilegeResponse, AccountPrivilege } from '../models/account.dto';
import AppConfig from '../../../config/app.config';
import CookieAuthGuard from '../../auth/guards/cookie.guard';
import Account from '../models/account.entity';
import AccountService from '../services/account.service';
import { AccountStatus } from '../../../config/constants';

@Controller('accounts')
@ApiUseTags('Accounts')
@UseGuards(CookieAuthGuard)
@UseInterceptors(ResponseRebuildInterceptor)
export default class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly config: AppConfig,
  ) {}

  @Get()
  @ApiOperation({ title: 'List of Accounts.', description: 'Get list of registered accounts.'})
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

  @Get('search')
  @ApiOperation({ title: 'Search Accounts.', description: 'Search registered accounts.'})
  @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
  @ApiImplicitQuery({ name: 'order', description: 'Order columns (username, fullname, or nickname)', type: ['username', 'fullname', 'nickname'], required: false })
  @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
  @ApiOkResponse({ description: 'Search result of user accounts.', type: ApiResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async search(
    @Query('term') term?: string,
    @Query('order') order: 'username' | 'fullname' | 'nickname' = 'fullname',
    @Query('sort') sort: 'asc' | 'desc' = 'asc',
  ): Promise<AccountResponse> {
    const { result: data = [] } = await this.accountService.all({ term, order, sort, page: 1, rowsPerPage: 1000 });

    return { data };
  }

  @Get('privileges')
  @ApiOperation({ title: 'Get current account privileges.', description: 'Get current account roles, available menus, and available services.' })
  @ApiOkResponse({ description: 'Account privileges.', type: ApiResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async privileges(@Request() request: any): Promise<AccountPrivilegeResponse> {
    const account: Account = request.user;
    const data: AccountPrivilege = await this.accountService.buildAccountPrivileges(account.id);

    return { data };
  }

  @Get(':id')
  @ApiOperation({ title: 'Get an account.', description: 'Get single account data based on ID.'})
  @ApiImplicitParam({ name: 'id', description: 'Account ID', type: 'string', required: true })
  @ApiOkResponse({ description: 'Account data.', type: ApiResponse })
  @ApiNotFoundResponse({ description: 'Account data not found.', type: ApiExceptionResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async get(@Param('id') id: string): Promise<AccountResponse> {
    const data: Account = await this.accountService.get(id);

    if (!data) throw new HttpException({ status: HttpStatus.NOT_FOUND, error: `Account not found.`}, HttpStatus.NOT_FOUND);

    return { data };
  }

  @Put(':id/update')
  @ApiOperation({ title: 'Update an account.', description: 'Renew account and profile data based on ID.' })
  @ApiImplicitParam({ name: 'id', description: 'Account ID', type: 'string', required: true })
  @ApiImplicitBody({ name: 'AccountProfileDTO', description: 'Account Profile form data', type: AccountProfileDTO, required: true})
  @ApiOkResponse({ description: 'Updated account and profile data.', type: ApiResponse })
  @ApiBadRequestResponse({description: 'Form data validation failed.', type: ApiExceptionResponse})
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async edit(@Param('id') id: string, @Body() form: AccountProfileDTO): Promise<AccountResponse> {
    try {
      const data: Account = await this.accountService.update(id, form);

      return { data };
    } catch (error) {
      throw error;
    }
  }

  @Put(':id/deactivate')
  @ApiOperation({ title: 'Deactivate an account.', description: 'Deactivate account, prevents a user from logging in using own account credential.' })
  @ApiImplicitParam({ name: 'id', description: 'Account ID', type: 'string', required: true })
  @ApiNoContentResponse({ description: 'Account data has beend deactivated.'})
  @ApiBadRequestResponse({description: 'Form data validation failed.', type: ApiExceptionResponse})
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async deactivate(@Param('id') id: string): Promise<void> {
    try {
      await this.accountService.setStatus(id, AccountStatus.ACTIVE);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ title: 'Delete an account', description: 'Delete account and all of its related content.' })
  @ApiImplicitParam({ name: 'id', description: 'Account ID', type: 'string', required: true })
  @ApiNoContentResponse({ description: 'Account data has beend deleted.'})
  @ApiNotFoundResponse({ description: 'Account data not found.', type: ApiExceptionResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.accountService.cleanDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
