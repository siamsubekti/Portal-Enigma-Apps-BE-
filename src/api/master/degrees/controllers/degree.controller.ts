import { DegreeService } from '../services/degree.service';
import { DegreePagedResponse, DegreeResponse, DegreeDTO } from '../models/degree.dto';
import { Get, Controller, Param, Post, Body, Delete, Put, Logger, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { ApiUseTags, ApiOkResponse, ApiInternalServerErrorResponse, ApiCreatedResponse,
    ApiOperation, ApiNotFoundResponse, ApiImplicitQuery, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import Degree from '../models/degree.entity';
import AppConfig from 'src/config/app.config';
import { PagingData } from 'src/libraries/responses/response.class';

@UseGuards(CookieAuthGuard)
@ApiUseTags('Degrees')
@Controller('degrees')
export class DegreeController {
    constructor(
        private readonly degreeService: DegreeService,
        private readonly config: AppConfig,
    ) { }

    @Get()
    @ApiOperation({ title: 'List of Degrees.', description: 'Get list of degrees from database.'})
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (name)', type: 'name', required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'List of degrees.', type: DegreePagedResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async all(
        @Query('term') term?: string,
        @Query('order') order: 'name' = 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page: number = 1,
    ): Promise<DegreePagedResponse> {
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.degreeService.all({ term, order, sort, page, rowsPerPage });
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
    @ApiOperation({ title: 'Create Degree', description: 'Create Degree' })
    @ApiCreatedResponse({ description: 'OK', type: DegreeResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async add(@Body() form: DegreeDTO): Promise<Degree> {
        const degree: Degree = await this.degreeService.insert(form);
        Logger.log(degree);
        return degree;
    }

    @Get(':id')
    @ApiOperation({ title: 'Detail Degree', description: 'Detail Degree' })
    @ApiOkResponse({ description: 'OK', type: DegreeResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Degree Not Found', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async get(@Param('id') params: number): Promise<Degree> {
        const degree: Degree = await this.degreeService.get(params);
        Logger.log(degree);
        return degree;
    }

    @Put(':id')
    @ApiOperation({ title: 'Update Degree', description: 'Update Degree' })
    @ApiOkResponse({ description: 'OK', type: DegreeResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Degree Not Found', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async edit(@Param('id') params: number, @Body() form: DegreeDTO): Promise<Degree> {
        const degree: Degree = await this.degreeService.update(params, form);
        Logger.log(degree);
        return degree;
    }

    @Delete(':id')
    @ApiOperation({ title: 'Delete Degree', description: 'Delete Degree' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Degree Not Found', type: ApiExceptionResponse })
    async remove(@Param('id') params: number): Promise<DeleteResult> {
        const { affected }: DeleteResult = await this.degreeService.delete(params);
        Logger.log({ affected });
        if (affected === 1) return null;
    }
}
