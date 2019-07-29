import RoleService from '../services/role.service';
import { RoleResponse, RolePagedResponse, RoleDTO } from '../models/role.dto';
import { Get, Controller, Body, Post, Logger, Param, Put, Delete, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import {
  ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse,
  ApiUseTags, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiImplicitQuery, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import Role from '../models/role.entity';
import AppConfig from 'src/config/app.config';
import { PagingData } from 'src/libraries/responses/response.class';

@ApiUseTags('Roles')
@Controller('roles')
@UseGuards(CookieAuthGuard)
export default class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly config: AppConfig) { }

  @Get()
  @ApiOperation({ title: 'List of Roles.', description: 'Get list of role from database.'})
  @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
  @ApiImplicitQuery({ name: 'order', description: 'Order columns (code, or name)', type: ['code', 'name'], required: false })
  @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
  @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
  @ApiOkResponse({ description: 'List of roles.', type: RolePagedResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  @UseInterceptors(ResponseRebuildInterceptor)
  async allRole(
      @Query('term') term?: string,
      @Query('order') order: 'code' | 'name' = 'name',
      @Query('sort') sort: 'asc' | 'desc' = 'asc',
      @Query('page') page: number = 1,
  ): Promise<RolePagedResponse> {
      const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
      const { result: data = [], totalRows } = await this.roleService.all({ term, order, sort, page, rowsPerPage });
      const paging: PagingData = {
      page,
      rowsPerPage,
      totalPages: Math.ceil( totalRows / rowsPerPage ),
      totalRows,
      };
      return {
          status: {
              code: '200',
              description: 'Success',
          }, data, paging };
  }

  @Post()
  @ApiOperation({ title: 'Create Role', description: 'Create Role' })
  @ApiCreatedResponse({ description: 'Role successfuly created.', type: RoleResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
  @UseInterceptors(ResponseRebuildInterceptor)
  @ApiBadRequestResponse({ description: 'Code has been use' })
  async addRole(@Body() form: RoleDTO): Promise<Role> {
    const role: Role = await this.roleService.insert(form);
    Logger.log(role);
    return role;
  }

  @Get(':id')
  @ApiOperation({ title: 'Detail Role', description: 'Detail Role' })
  @ApiOkResponse({ description: 'Detail Role', type: RoleResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
  @UseInterceptors(ResponseRebuildInterceptor)
  async getRole(@Param('id') id: number): Promise<Role> {
    const role: Role = await this.roleService.get(id);
    Logger.log(role);
    return role;
  }

  @Put(':id')
  @ApiOperation({ title: 'Update Role', description: 'Update Role' })
  @ApiOkResponse({ description: 'Updated successfuly.', type: RoleResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
  @UseInterceptors(ResponseRebuildInterceptor)
  async editRole(@Param('id') id: number, @Body() form: RoleDTO): Promise<Role> {
    const role: Role = await this.roleService.update(id, form);
    Logger.log(role);
    return role;
  }

  @Delete(':id')
  @ApiOperation({ title: 'Delete Role', description: 'Delete Role' })
  @ApiNotFoundResponse({ description: 'Role Not Found', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
  async deleteRole(@Param('id') params: number): Promise<DeleteResult> {
    const { affected }: DeleteResult = await this.roleService.delete(params);
    if (affected === 1) return null;
  }
}
