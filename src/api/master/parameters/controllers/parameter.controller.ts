import { Controller, Get, InternalServerErrorException, Post, Put, Delete, HttpCode, Param, Body, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import ParameterService from '../services/parameter.service';
import ParameterDTO, { ParameterResponse, ParameterPageResponse, ParameterResponses } from '../models/parameter.dto';
import Parameter from '../models/parameter.entity';
import {
    ApiOkResponse,
    ApiOperation,
    ApiUseTags,
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiCreatedResponse,
    ApiUnauthorizedResponse,
    ApiImplicitQuery,
    ApiNoContentResponse,
} from '@nestjs/swagger';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import { PagingData } from '../../../../libraries/responses/response.class';
import AppConfig from '../../../../config/app.config';

@Controller('parameters')
@ApiUseTags('Parameters')
@UseGuards(CookieAuthGuard)
export default class ParameterController {

    constructor(
        private readonly parameterService: ParameterService,
        private readonly config: AppConfig,
    ) { }

    @Get()
    @ApiOperation({ title: 'List of Parameters', description: 'API get list of Parameters' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (key, value)', type: ['key', 'value'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'If success get list of Parameters', type: ParameterPageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async find(
        @Query('term') term?: string,
        @Query('order') order: 'key' | 'value' = 'key',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page: number = 1,
    ): Promise<ParameterResponses> {
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.parameterService.find({ term, order, sort, page, rowsPerPage });
        const paging: PagingData = {
            page: Number(page),
            rowsPerPage,
            totalPages: Math.ceil(totalRows / rowsPerPage),
            totalRows,
        };

        return { data, paging };
    }

    @Get('search')
    @ApiOperation({ title: 'Search Parameters', description: 'API search of Parameters' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (key, value)', type: ['key', 'value'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'If success search of Parameters', type: ParameterResponses })
    @UseInterceptors(ResponseRebuildInterceptor)
    async search(
        @Query('term') term?: string,
        @Query('order') order: 'key' | 'value' = 'key',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<ParameterResponses> {
        const { result: data = [] } = await this.parameterService.find({ term, order, sort, page: 1, rowsPerPage: 1000 });
        // Logger.log(`RESULT ${data}`);
        return { data };
    }

    @Get(':id')
    @ApiOperation({ title: 'Get a Parameter', description: 'API Get parameter by id.' })
    @ApiOkResponse({ description: 'Success to get skill by id.', type: ParameterResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getById(@Param('id') id: number): Promise<Parameter> {
        const parameter: Parameter = await this.parameterService.findById(id);
        return parameter;
    }

    @Post()
    @ApiOperation({ title: 'Create Parameter', description: 'API to create Parameter' })
    @ApiCreatedResponse({ description: 'If success insert parameter', type: ParameterResponse })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() parameterDto: ParameterDTO): Promise<Parameter> {
        const parameter: Parameter = await this.parameterService.create(parameterDto);
        return parameter;
    }

    @Put(':id')
    @ApiOperation({ title: 'Update Parameter', description: 'API to update Parameter' })
    @ApiOkResponse({ description: 'If success update Parameter', type: ParameterResponse })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async update(@Param('id') id: number, @Body() parameterDto: ParameterDTO): Promise<Parameter> {
        const parameter: Parameter = await this.parameterService.update(id, parameterDto);
        return parameter;
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'Delete Paramter', description: 'API to delete Parameter' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @ApiNoContentResponse({ description: 'Successfully delete parameter.' })
    async delete(@Param('id') id: number): Promise<any> {
        const { affected } = await this.parameterService.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }
}
