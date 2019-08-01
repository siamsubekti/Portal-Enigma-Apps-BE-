import { Controller, Get, Post, Body, Delete, Param, Put, InternalServerErrorException, HttpCode, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import TemplateService from '../services/template.service';
import {
    ApiUseTags,
    ApiOperation,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiNotFoundResponse,
    ApiCreatedResponse,
    ApiUnauthorizedResponse,
    ApiImplicitQuery,
} from '@nestjs/swagger';
import { TemplateDTO, TemplatePageResponse, TemplateResponse, TemplateResponses } from '../models/template.dto';
import Template from '../models/template.entity';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import AppConfig from '../../../../config/app.config';
import { PagingData } from '../../../../libraries/responses/response.class';

@Controller('templates')
@ApiUseTags('Templates')
@UseGuards(CookieAuthGuard)
export default class TemplateController {

    constructor(
        private readonly templateService: TemplateService,
        private readonly config: AppConfig,
    ) { }

    @Get()
    @ApiOperation({ title: 'List of Templates', description: 'API search Templates' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (name, type)', type: ['name', 'type'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'If success get list of Templates', type: TemplatePageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async find(
        @Query('term') term?: string,
        @Query('order') order: 'type' | 'name' = 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page: number = 1,
    ): Promise<TemplateResponses> {
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.templateService.find({ term, order, sort, page, rowsPerPage });
        const paging: PagingData = {
            page,
            rowsPerPage,
            totalPages: Math.ceil(totalRows / rowsPerPage),
            totalRows,
        };

        return { data, paging };
    }

    @Get('search')
    @ApiOperation({ title: 'Search Template', description: 'API search Template by keywords' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (type, name)', type: ['type', 'name'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'If success serach Template', type: TemplatePageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async search(
        @Query('term') term?: string,
        @Query('order') order: 'type' | 'name' = 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<TemplateResponses> {
        const { result: data = [] } = await this.templateService.search({ term, order, sort });

        return { data };
    }

    @Get(':id')
    @ApiOperation({ title: 'Get a Template', description: 'API Get template by id.' })
    @ApiOkResponse({ description: 'Success to get template by id.', type: TemplateResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getById(@Param('id') id: number): Promise<Template> {
        const template: Template = await this.templateService.findById(id);
        return template;
    }

    @Post()
    @ApiOperation({ title: 'Create Template', description: 'API insert into templates' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiCreatedResponse({ description: 'Success to create template.', type: TemplateResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() templateDto: TemplateDTO): Promise<Template> {
        const template: Template = await this.templateService.create(templateDto);
        return template;
    }

    @Put(':id')
    @ApiOperation({ title: 'Update Template', description: 'API Update template' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to update template.', type: TemplateResponse })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async update(@Param('id') id: number, @Body() templateDto: TemplateDTO): Promise<Template> {
        const template: Template = await this.templateService.update(id, templateDto);
        return template;
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'Delete Template', description: 'API delete template' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    async delete(@Param('id') id: number): Promise<any> {
        const { affected }: any = await this.templateService.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }
}
