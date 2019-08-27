import { Controller, Get, Post, Body, Delete, Param, HttpCode, InternalServerErrorException, Put, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import RegionService from '../services/region.service';
import {
    ApiUseTags,
    ApiOperation,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiUnauthorizedResponse,
    ApiImplicitQuery,
    ApiNoContentResponse,
} from '@nestjs/swagger';
import { RegionDTO, RegionResponse, RegionPageResponse, RegionResponses, RegionSearchResponse } from '../models/region.dto';
import Region from '../models/region.entity';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import { PagingData } from '../../../../libraries/responses/response.class';
import AppConfig from '../../../../config/app.config';

@Controller('regions')
@ApiUseTags('Regions')
@UseGuards(CookieAuthGuard)
export default class RegionController {

    constructor(
        private readonly regionServices: RegionService,
        private readonly config: AppConfig,
    ) { }

    @Get()
    @ApiOperation({ title: 'List of Regions', description: 'API search Regions' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (type, name)', type: ['type', 'name'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'If success get list of Regions', type: RegionPageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async find(
        @Query('term') term?: string,
        @Query('order') order: 'type' | 'name' = 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page: number = 1,
    ): Promise<RegionResponses> {
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.regionServices.find({ term, order, sort, page, rowsPerPage });
        const paging: PagingData = {
            page: Number(page),
            rowsPerPage,
            totalPages: Math.ceil(totalRows / rowsPerPage),
            totalRows,
        };

        return { data, paging };
    }

    @Get('type')
    @ApiOperation({ title: 'List of Regions based Type', description: 'API search Regions' })
    @ApiImplicitQuery({ name: 'type', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'If success get list of Regions', type: RegionPageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async findByType(
        @Query('type') term: 'PROVINSI' | 'KABUPATEN' | 'KECAMATAN' | 'KELURAHAN' = 'PROVINSI',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<Region[]> {
        return await this.regionServices.findByType({ term, sort });

    }

    @Get('search')
    @ApiOperation({ title: 'Search Regions', description: 'API search Regions by keywords' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'order', description: 'Order columns (type, name)', type: ['type', 'name'], required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'If success serach Regions', type: RegionSearchResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async search(
        @Query('term') term?: string,
        @Query('order') order?: 'type' | 'name',
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<RegionResponses> {
        const { result: data = [] } = await this.regionServices.find({ term, order, sort, page: 1, rowsPerPage: 1000 });

        return { data };
    }

    @Get(':id/subs')
    @ApiOperation({ title: 'Get a Region include their childrens.', description: 'API Get region by Id include their childrens.' })
    @ApiOkResponse({ description: 'Success to get region.', type: RegionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getRegionChild(@Param('id') id: string): Promise<Region> {
        const region: Region = await this.regionServices.findChild(id);
        return region;
    }

    @Get(':id')
    @ApiOperation({ title: 'Get a Region', description: 'API Get region by Id' })
    @ApiOkResponse({ description: 'Success to get region by Id.', type: RegionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getById(@Param('id') id: string): Promise<Region> {
        const region: Region = await this.regionServices.findById(id);
        return region;
    }

    @Post()
    @ApiOperation({ title: 'Create Region', description: 'API create regions' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiCreatedResponse({ description: 'Success to create regions.', type: RegionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() regionDto: RegionDTO): Promise<Region> {
        const region: Region = await this.regionServices.create(regionDto);
        return region;
    }

    @Put(':id')
    @ApiOperation({ title: 'Update Region', description: 'API update region' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to update region.', type: RegionResponse })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async update(@Param('id') id: string, @Body() regionDto: RegionDTO): Promise<Region> {
        const region: Region = await this.regionServices.update(id, regionDto);
        return region;
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'Delete Region', description: 'API delete region' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @ApiNoContentResponse({ description: 'Successfully delete region.' })
    async delete(@Param('id') id: string): Promise<any> {
        const { affected }: DeleteResult = await this.regionServices.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }
}
