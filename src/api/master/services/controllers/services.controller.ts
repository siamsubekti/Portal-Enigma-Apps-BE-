import { Controller, Get, UseInterceptors, Param, Post, Body, Delete, HttpCode, InternalServerErrorException, Put, Query, UseGuards } from '@nestjs/common';
import ServicesService from '../services/services.service';
import {
    ApiOkResponse,
    ApiOperation,
    ApiUseTags,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiImplicitQuery,
    ApiBadRequestResponse,
    ApiUnauthorizedResponse,
    ApiUnprocessableEntityResponse,
    ApiNoContentResponse,
} from '@nestjs/swagger';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import { ServiceResponse, ServicePageResponse, ServiceDTO, ServiceResponses, ServiceSearchResponse } from '../models/service.dto';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import Service from '../models/service.entity';
import { PagingData } from '../../../../libraries/responses/response.class';
import AppConfig from '../../../../config/app.config';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';

@Controller('services')
@ApiUseTags('Services')
@UseGuards(CookieAuthGuard)
export default class ServicesController {

    constructor(
        private service: ServicesService,
        private readonly config: AppConfig,
    ) { }

    @Get()
    @ApiOperation({ title: 'List of Services', description: 'API get list of services' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (code, name)', type: ['code', 'name'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'If success search list of Services', type: ServicePageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async find(
        @Query('term') term?: string,
        @Query('order') order: 'code' | 'name' = 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page: number = 1,
    ): Promise<ServiceResponses> {
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.service.find({ term, order, sort, page, rowsPerPage });
        const paging: PagingData = {
            page: Number(page),
            rowsPerPage,
            totalPages: Math.ceil(totalRows / rowsPerPage),
            totalRows,
        };

        return { data, paging };
    }

    @Get('search')
    @ApiOperation({ title: 'Search of Services', description: 'API search services' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (code, name)', type: ['code', 'name'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'If success search Services', type: ServiceSearchResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async search(
        @Query('term') term?: string,
        @Query('order') order: 'code' | 'name' = 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<ServiceResponses> {
        const { result: data = [] } = await this.service.search({ term, order, sort });

        return { data };
    }

    @Get(':id')
    @ApiOperation({ title: 'Get a Service', description: 'API get services by id.' })
    @ApiOkResponse({ description: 'If success get service by id', type: ServiceResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getById(@Param('id') id: number): Promise<Service> {
        return await this.service.findById(id);
    }

    @Post()
    @ApiOperation({ title: 'Create Service', description: 'API to create service.' })
    @ApiCreatedResponse({ description: 'If success created service', type: ServiceResponse })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() serviceDto: ServiceDTO): Promise<Service> {
        return await this.service.create(serviceDto);
    }

    @Put(':id')
    @ApiOperation({ title: 'Update Service', description: 'API to create service.' })
    @ApiOkResponse({ description: 'If success update service', type: ServiceResponse })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async update(@Param('id') id: number, @Body() form: ServiceDTO): Promise<Service> {
        return await this.service.update(id, form);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiNoContentResponse({ description: 'If successfully deleted.' })
    @ApiOperation({ title: 'Delete Service', description: 'API to delete service by id.' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @ApiUnprocessableEntityResponse({ description: 'If service have any relations', type: ApiExceptionResponse })
    async delete(@Param('id') id: number): Promise<any> {
        const { affected } = await this.service.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }


}
