import AcademyService from '../services/academy.service';
import { Controller, Get, Body, Post, Logger, Param, Put, Delete, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import {
    ApiUseTags, ApiOperation, ApiImplicitParam,
    ApiCreatedResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse,
    ApiOkResponse, ApiNotFoundResponse, ApiImplicitQuery, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AcademyResponse, AcademyDTO, AcademiesPagedResponse } from '../models/academy.dto';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse, ApiResponse } from '../../../../libraries/responses/response.type';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import { PagingData } from '../../../../libraries/responses/response.class';
import AppConfig from '../../../../config/app.config';
import Academy from '../models/academy.entity';

@UseGuards(CookieAuthGuard)
@ApiUseTags('Academies')
@Controller('academies')
export default class AcademyController {
    constructor(
        private academyService: AcademyService,
        private readonly config: AppConfig) { }

    @Get()
    @ApiOperation({ title: 'List of Academies.', description: 'Get list of academies from database.'})
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (code, name, or phone)', type: ['code', 'name', 'phone'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'List of academies.', type: AcademiesPagedResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async all(
        @Query('term') term?: string,
        @Query('order') order: 'code' | 'name' | 'phone' = 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page: number = 1,
    ): Promise<AcademiesPagedResponse> {
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.academyService.all({ term, order, sort, page, rowsPerPage });
        const paging: PagingData = {
        page,
        rowsPerPage,
        totalPages: Math.ceil( totalRows / rowsPerPage ),
        totalRows,
        };
        return { data, paging };
    }

    @Get('search')
    @ApiOperation({ title: 'Search Academy.', description: 'Search academy.'})
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (code, name, phone, or type)', type: ['code', 'name', 'phone', 'type'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'Search result of academy.', type: ApiResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @ApiInternalServerErrorResponse({ description: 'API experienced error.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async search(
        @Query('term') term?: string,
        @Query('order') order: 'code' | 'name' | 'phone' | 'type' = 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<AcademyResponse> {
        const { result: data = [] } = await this.academyService.all({ term, order, sort, page: 1, rowsPerPage: 1000 });

        return { data };
    }

    @Post()
    @ApiOperation({ title: 'Create Academy', description: 'Create Academy' })
    @ApiCreatedResponse({ description: 'OK', type: AcademyResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiBadRequestResponse({ description: 'Code has been use', type: ApiExceptionResponse })
    @ApiBadRequestResponse({ description: 'Phone has been use', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async add(@Body() form: AcademyDTO): Promise<Academy> {
        const academy: Academy = await this.academyService.insert(form);
        Logger.log(academy);
        return academy;
    }

    @Get(':id')
    @ApiOperation({ title: 'Detail Academy', description: 'Detail Academy' })
    @ApiImplicitParam({ name: 'id' })
    @ApiOkResponse({ description: 'OK', type: AcademyResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Academy Not Found', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async get(@Param('id') id: number): Promise<Academy> {
        const academy: Academy = await this.academyService.get(id);
        Logger.log(academy);
        return academy;
    }

    @Put(':id')
    @ApiOperation({ title: 'Update Academy', description: 'Update Academy' })
    @ApiOkResponse({ description: 'OK', type: AcademyResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Academy Not Found', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async edit(@Param('id') id: number, @Body() form: AcademyDTO): Promise<Academy> {
        const academy: Academy = await this.academyService.update(id, form);
        Logger.log(academy);
        return academy;
    }

    @Delete(':id')
    @ApiOperation({ title: 'Delete Academy', description: 'Delete Academy' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: `Academy Not Found`, type: ApiExceptionResponse })
    async remove(@Param('id') id: number): Promise<DeleteResult> {
        const { affected }: DeleteResult = await this.academyService.delete(id);
        Logger.log(affected);
        if (affected === 1) return null;
    }
}
