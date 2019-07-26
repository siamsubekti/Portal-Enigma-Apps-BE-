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
} from '@nestjs/swagger';
import { Controller, UseGuards, Get, Put, Query, Param, Body } from '@nestjs/common';
import { PagingData } from '../../../libraries/responses/response.class';
import { ApiPagedResponse, ApiExceptionResponse, ApiResponse } from '../../../libraries/responses/response.type';
import { AccountResponse, AccountProfileDTO, AccountPrivilegeResponse, AccountPrivilege } from '../models/account.dto';
import AccountService from '../services/account.service';
import AppConfig from '../../../config/app.config';
import CookieAuthGuard from '../../auth/guards/cookie.guard';
import Account from '../models/account.entity';

@Controller('accounts')
@ApiUseTags('Accounts')
@UseGuards(CookieAuthGuard)
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

  @Get(':id')
  @ApiOperation({ title: 'Get an account.', description: 'Get single account data based on ID.'})
  @ApiImplicitParam({ name: 'id', description: 'Account ID', type: 'string', required: true })
  @ApiOkResponse({ description: 'Account data.', type: ApiResponse })
  @ApiNotFoundResponse({ description: 'Account data not found.', type: ApiExceptionResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async get(@Param('id') id: string): Promise<AccountResponse> {
    const data: Account = await this.accountService.get(id);

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
    const data: Account = await this.accountService.update(id, form);

    return { data };
  }

  // @Put(':id/suspend')
  // @ApiExcludeEndpoint()
  // @ApiOperation({ title: 'Suspend an account.', description: 'Suspend account, prevents a user from logging in using own account credential.' })
  // @ApiImplicitParam({ name: 'id', description: 'Account ID', type: 'string', required: true })
  // @ApiOkResponse({ description: 'Updated account and profile data.', type: ApiResponse })
  // @ApiBadRequestResponse({description: 'Form data validation failed.', type: ApiExceptionResponse})
  // @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  // @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  // async suspend(@Param('id') id: string): Promise<void> {
  //   return undefined;
  // }

  // @Put(':id/blacklist')
  // @ApiExcludeEndpoint()
  // @ApiOperation({ title: 'Blacklist an account.', description: 'Effectively block an account, prevents a user from logging in using own account credential.' })
  // @ApiImplicitParam({ name: 'id', description: 'Account ID', type: 'string', required: true })
  // @ApiOkResponse({ description: 'Updated account and profile data.', type: ApiResponse })
  // @ApiBadRequestResponse({description: 'Form data validation failed.', type: ApiExceptionResponse})
  // @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  // @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  // async blacklist(@Param('id') id: string): Promise<void> {
  //   return undefined;
  // }

  // @Delete(':id')
  // @ApiExcludeEndpoint()
  // @ApiOperation({ title: 'Delete an account', description: 'Delete account and all of its related content.' })
  // @ApiImplicitParam({ name: 'id', description: 'Account ID', type: 'string', required: true })
  // @ApiNoContentResponse({ description: 'Account data has beend deleted.'})
  // @ApiNotFoundResponse({ description: 'Account data not found.', type: ApiExceptionResponse })
  // @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  // @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  // async delete(@Param('id') id: string): Promise<void> {
  //   return undefined;
  // }

  @Get('privileges/:id')
  @ApiOperation({ title: 'Get current account privileges.', description: 'Get current account roles, available menus, and available services.' })
  @ApiImplicitParam({ name: 'id', description: 'Account ID', type: 'string', required: true })
  @ApiOkResponse({ description: 'Account privileges.', type: ApiResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async privileges(@Param('id') id: string): Promise<AccountPrivilegeResponse> {
    const data: AccountPrivilege = await this.accountService.buildAccountPrivileges(id);

    return { data };
  }
}
