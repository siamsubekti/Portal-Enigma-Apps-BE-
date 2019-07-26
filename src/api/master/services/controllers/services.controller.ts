import { Controller, Get, UseInterceptors, Param, Post, Body, Delete, HttpCode, InternalServerErrorException, Put, Query } from '@nestjs/common';
import { ServicesService } from '../services/services.service';
import { ApiOkResponse, ApiOperation, ApiUseTags, ApiCreatedResponse, ApiNotFoundResponse, ApiImplicitQuery } from '@nestjs/swagger';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import { ServiceResponse, ServicePageResponse, ServiceDTO, ServiceResponses, UpdateServiceDTO } from '../models/service.dto';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import Service from '../models/service.entity';
import { PagingData } from '../../../../libraries/responses/response.class';
import AppConfig from '../../../../config/app.config';

@Controller('services')
@ApiUseTags('Services')
export class ServicesController {

    constructor(
        private service: ServicesService,
        private readonly config: AppConfig,
    ) { }

    @Get()
    @ApiOperation({ title: 'GET Services', description: 'API Get list of services' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (code, name)', type: ['code', 'name'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'If success get list of Services', type: ServicePageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async get(
        @Query('term') term?: string,
        @Query('order') order: 'username' | 'fullname' | 'nickname' = 'fullname',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page: number = 1,
    ): Promise<ServiceResponses> {
        // return await this.service.findAll();
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.service.findAll({ term, order, sort, page, rowsPerPage });
        const paging: PagingData = {
            page,
            rowsPerPage,
            totalPages: Math.ceil(totalRows / rowsPerPage),
            totalRows,
        };

        return { data, paging };
    }

    @Get(':id')
    @ApiOperation({ title: 'GET Service by Id', description: 'API get services by id.' })
    @ApiOkResponse({ description: 'If success get service by id', type: ServiceResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getById(@Param('id') id: number): Promise<Service> {
        return await this.service.findById(id);
    }

    @Post()
    @ApiOperation({ title: 'CREATE Service', description: 'API to create service.' })
    @ApiCreatedResponse({ description: 'If success created service', type: ServiceResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() serviceDto: ServiceDTO): Promise<Service> {
        return await this.service.create(serviceDto);
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Service', description: 'API to create service.' })
    @ApiOkResponse({ description: 'If success update service', type: ServiceResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async update(@Param('id') id: number, @Body() form: UpdateServiceDTO): Promise<Service> {
        return await this.service.update(id, form);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Service', description: 'API to delete service by id.' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    async delete(@Param('id') id: number): Promise<any> {
        const { affected } = await this.service.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }


}
