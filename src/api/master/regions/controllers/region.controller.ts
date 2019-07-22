import { Controller, Get, Post, Body, Delete, Param, HttpCode, InternalServerErrorException, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import { RegionService } from '../services/region.service';
import { ApiUseTags, ApiOperation, ApiBadRequestResponse, ApiOkResponse, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { RegionDTO, RegionResponse, RegionPageResponse } from '../models/region.dto';
import Region from '../models/region.entity';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse } from 'src/libraries/responses/response.type';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';

@Controller('regions')
@ApiUseTags('Regions')
@UseGuards(CookieAuthGuard)
export class RegionController {

    constructor(
        private readonly regionServices: RegionService,
    ) { }

    @Get()
    @ApiOperation({ title: 'GET Regions', description: 'API Get list of regions' })
    @ApiOkResponse({ description: 'Success to get list of regions.', type: RegionPageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async get(): Promise<Region[]> {
        const regions: Region[] = await this.regionServices.findAll();
        return regions;
    }

    @Get(':id')
    @ApiOperation({ title: 'GET Region By Id', description: 'API Get region by Id' })
    @ApiOkResponse({ description: 'Success to get region by Id.', type: RegionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getById(@Param('id') id: string): Promise<Region> {
        const region: Region = await this.regionServices.findById(id);
        return region;
    }

    @Post()
    @ApiOperation({ title: 'CREATE Region', description: 'API create regions' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiCreatedResponse({ description: 'Success to create regions.', type: RegionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() regionDto: RegionDTO): Promise<Region> {
        const region: Region = await this.regionServices.create(regionDto);
        return region;
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Region', description: 'API update region' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to update region.', type: RegionResponse })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async update(@Param('id') id: string, @Body() regionDto: RegionDTO): Promise<Region> {
        const region: Region = await this.regionServices.update(id, regionDto);
        return region;
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Region', description: 'API delete region' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    async delete(@Param('id') id: string): Promise<any> {
        const { affected }: DeleteResult = await this.regionServices.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }
}
