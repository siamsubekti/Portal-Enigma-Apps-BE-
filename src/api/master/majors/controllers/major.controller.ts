import MajorService from '../services/major.service';
import { Controller, Get, Logger, Post, Body, Param, Put, Delete, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import {
    ApiUseTags, ApiOperation, ApiCreatedResponse,
    ApiOkResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiImplicitQuery, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MajorResponse, MajorDTO, MajorsPagedResponse } from '../models/major.dto';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse, ApiResponse } from '../../../../libraries/responses/response.type';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import Major from '../models/major.entity';
import AppConfig from '../../../../config/app.config';
import { PagingData } from '../../../../libraries/responses/response.class';

@UseGuards(CookieAuthGuard)
@ApiUseTags('Majors')
@Controller('majors')
export default class MajorController {
    constructor(
        private readonly majorService: MajorService,
        private readonly config: AppConfig,
        ) { }

    @Get()
    @ApiOperation({ title: 'List of Majors.', description: 'Get list of majors from database.'})
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (name)', type: 'name', required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'List of majors.', type: MajorsPagedResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async all(
        @Query('term') term?: string,
        @Query('order') order: 'name' = 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page: number = 1,
    ): Promise<MajorsPagedResponse> {
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.majorService.all({ term, order, sort, page, rowsPerPage });
        const paging: PagingData = {
        page,
        rowsPerPage,
        totalPages: Math.ceil( totalRows / rowsPerPage ),
        totalRows,
        };
        return { data, paging };
    }

    @Get('search')
    @ApiOperation({ title: 'Search Major.', description: 'Search major.'})
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (name)', type: ['name'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'Search result of major.', type: ApiResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async search(
        @Query('term') term?: string,
        @Query('order') order: 'name' = 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<MajorResponse> {
        const { result: data = [] } = await this.majorService.all({ term, order, sort, page: 1, rowsPerPage: 1000 });

        return { data };
    }

    @Post('')
    @ApiOperation({ title: 'Create Major', description: 'Create Major' })
    @ApiCreatedResponse({ description: 'OK', type: MajorResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async addAcademy(@Body() form: MajorDTO): Promise<Major> {
        const major: Major = await this.majorService.insertMajor(form);
        return major;
    }

    @Get(':id')
    @ApiOperation({ title: 'Detail Major', description: 'Detail Major' })
    @ApiOkResponse({ description: 'OK', type: MajorResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Major Not Found', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getAcademyById(@Param('id') params: number): Promise<Major> {
        const major: Major = await this.majorService.getDetailMajor(params);
        Logger.log(major);
        return major;
    }

    @Put(':id')
    @ApiOperation({ title: 'Update Major', description: 'Update Major' })
    @ApiOkResponse({ description: 'OK', type: MajorResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Major Not Found', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async updateAcademy(@Param('id') id: number, @Body() form: MajorDTO): Promise<Major> {
        const major: Major = await this.majorService.update(id, form);
        return major;
    }

    @Delete(':id')
    @ApiOperation({ title: 'Delete Major', description: 'Delete Major' })
    @ApiNotFoundResponse({ description: 'Major Not Found', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    async DeleteAcademy(@Param('id') id: number): Promise<DeleteResult> {
        const { affected }: DeleteResult = await this.majorService.delete(id);
        Logger.log(affected);
        if (affected === 1) return null;
    }
}
