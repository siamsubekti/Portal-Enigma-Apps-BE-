import { Controller, Get, Post, Body, Delete, Param, HttpCode, InternalServerErrorException, Put, UseInterceptors } from '@nestjs/common';
import { RegionService } from '../services/region.service';
import { ApiUseTags, ApiOperation, ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { RegionDTO, RegionResponse, RegionPageResponse } from '../models/region.dto';
import Region from '../models/region.entity';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse } from 'src/libraries/responses/response.type';
import { ResponseRebuildInterceptor } from 'src/libraries/responses/response.interceptor';

@Controller('regions')
@ApiUseTags('Regions')
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

    @Post()
    @ApiOperation({ title: 'CREATE Region', description: 'API create regions' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to create regions.', type: RegionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() regionDto: RegionDTO): Promise<Region> {
        const region: Region = await this.regionServices.create(regionDto);
        return region;
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Region', description: 'API update region' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to update region.', type: RegionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async update(@Param('id') id: string, @Body() regionDto: RegionDTO): Promise<Region> {
        const region: Region = await this.regionServices.update(id, regionDto);
        return region;
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Region', description: 'API delete region' })
    async delete(@Param('id') id: string): Promise<any> {
        const { affected }: DeleteResult = await this.regionServices.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }
}
