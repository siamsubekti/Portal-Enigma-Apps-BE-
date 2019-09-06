import { Controller, UseInterceptors, Post, Body, Get, Query, Param, UseGuards, Put } from '@nestjs/common';
import {
  ApiImplicitBody,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiUseTags,
  ApiImplicitQuery,
  ApiOkResponse,
  ApiImplicitParam,
  ApiNotFoundResponse } from '@nestjs/swagger';
import { ResponseRebuildInterceptor } from '../../../libraries/responses/response.interceptor';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import { PagingData } from '../../../libraries/responses/response.class';
import { ContactFormDTO, MessageResponse, MessageQueryParams, MessagePagedResponse } from '../models/message.dto';
import AppConfig from '../../../config/app.config';
import MessageService from '../services/message.service';
import Message from '../models/message.entity';
import CookieAuthGuard from '../../auth/guards/cookie.guard';

@Controller('messages')
@ApiUseTags('Messages')
@UseInterceptors(ResponseRebuildInterceptor)
export default class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly config: AppConfig,
  ) { }

  @Get()
  @UseGuards(CookieAuthGuard)
  @ApiOperation({ title: 'List of messages.', description: 'Get list of messages.' })
  @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
  @ApiImplicitQuery({
    name: 'order',
    description: 'Order columns (email, fullname, subject, created date, or read date)',
    type: ['email', 'fullname', 'subject', 'createdAt', 'readAt'],
    required: false,
  })
  @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
  @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
  @ApiOkResponse({ description: 'List of messages.', type: MessagePagedResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async all(
    @Query('term') term?: string,
    @Query('order') order: 'email' | 'fullname' | 'subject' | 'createdAt' | 'readAt' = 'createdAt',
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
    @Query('page') page: number = 1,
  ): Promise<MessagePagedResponse> {
    const rowsPerPage: number = +this.config.get('ROWS_PER_PAGE');
    const queryParams: MessageQueryParams = { term, order, sort, page, rowsPerPage };

    return await this.allMessages(queryParams);
  }

  @Get('/:readStatus')
  @UseGuards(CookieAuthGuard)
  @ApiOperation({ title: 'List of messages.', description: 'Get list of messages.' })
  @ApiImplicitParam({ name: 'readStatus', description: 'Read or unread status', type: ['read', 'unread'], required: true })
  @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
  @ApiImplicitQuery({
    name: 'order',
    description: 'Order columns (email, fullname, subject, created date, or read date)',
    type: ['email', 'fullname', 'subject', 'createdAt', 'readAt'],
    required: false,
  })
  @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
  @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
  @ApiOkResponse({ description: 'List of messages.', type: MessagePagedResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async allByReadStatus(
    @Param('readStatus') readStatus: 'read' | 'unread',
    @Query('term') term?: string,
    @Query('order') order: 'email' | 'fullname' | 'subject' | 'createdAt' | 'readAt' = 'createdAt',
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
    @Query('page') page: number = 1,
  ): Promise<MessagePagedResponse> {
    const read: boolean = (!readStatus ? undefined : ( readStatus && readStatus === 'unread' ? false : true ));
    const rowsPerPage: number = +this.config.get('ROWS_PER_PAGE');
    const queryParams: MessageQueryParams = { read, term, order, sort, page, rowsPerPage };

    return await this.allMessages(queryParams);
  }

  @Get(':id')
  @UseGuards(CookieAuthGuard)
  @ApiOperation({ title: 'Message detail.', description: 'Get detailed message information.' })
  @ApiImplicitParam({ name: 'id', description: 'Message ID', type: 'string' })
  @ApiOkResponse({ description: 'Detailed message.', type: MessageResponse })
  @ApiNotFoundResponse({ description: 'Message not found.', type: ApiExceptionResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async find(@Param('id') id: number): Promise<MessageResponse> {
    const data: any = await this.messageService.find(id);

    return { data };
  }

  @Put(':id/read')
  @UseGuards(CookieAuthGuard)
  @ApiOperation({ title: 'Update message read status.', description: 'Update read date of a message.' })
  @ApiImplicitParam({ name: 'id', description: 'Message ID', type: 'string' })
  @ApiOkResponse({ description: 'Detailed message.', type: MessageResponse })
  @ApiNotFoundResponse({ description: 'Message not found.', type: ApiExceptionResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async updateRead(@Param('id') id: number): Promise<MessageResponse> {
    const data: any = await this.messageService.read(id);

    return { data };
  }

  @Post()
  @ApiOperation({ title: 'Creates message.', description: 'Creates message received from contact us form.' })
  @ApiImplicitBody({ name: 'ContactFormDTO', description: 'Contact us form data', type: ContactFormDTO })
  @ApiCreatedResponse({ description: 'Message created.', type: MessageResponse })
  @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
  @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
  async create(@Body() data: ContactFormDTO): Promise<Message> {
    return this.messageService.create(data);
  }

  private async allMessages(queryParams: MessageQueryParams): Promise<MessagePagedResponse> {
    const { page, rowsPerPage } = queryParams;
    const totalRows: number = await this.messageService.count(queryParams);
    const data: any[] = totalRows > 0 ? await this.messageService.all(queryParams) : [];
    const paging: PagingData = {
      page,
      totalPages: Math.ceil(totalRows / rowsPerPage),
      totalRows,
      rowsPerPage,
    };

    return { data, paging };
  }
}
