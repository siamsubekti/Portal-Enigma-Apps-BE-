import { Controller, Get, Post, Body, Delete, Param, HttpCode, InternalServerErrorException, Put } from '@nestjs/common';
import { RegionService } from '../services/region.service';
import ResponseUtil from 'src/libraries/response/response.util';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { RegionDTO, RegionResponse, RegionPageResponse } from '../models/region.dto';
import Region from '../models/region.entity';
import { DeleteResult } from 'typeorm';

@Controller('regions')
@ApiUseTags('Regions')
export class RegionController {

    constructor(
        private readonly regionServices: RegionService,
        private readonly responseUtils: ResponseUtil
    ) { }

    @Get()
    @ApiOperation({ title: 'GET Regions', description: 'API Get list of regions' })
    async get(): Promise<RegionPageResponse> {
        const regions: Region[] = await this.regionServices.findAll();
        return this.responseUtils.rebuildPagedResponse(regions);
    }

    @Post()
    @ApiOperation({ title: 'CREATE Region', description: 'API create regions' })
    async insert(@Body() regionDto: RegionDTO): Promise<RegionResponse> {
        const region: Region = await this.regionServices.create(regionDto);
        return this.responseUtils.rebuildResponse(region);
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Region', description: 'API update region' })
    async update(@Param('id') id: string, @Body() regionDto: RegionDTO): Promise<RegionResponse> {
        const region: Region = await this.regionServices.update(id, regionDto);
        return this.responseUtils.rebuildResponse(region);
    }

    @Delete(':id')
    @ApiOperation({ title: 'DELETE Region', description: 'API delete region' })
    @HttpCode(204)
    async delete(@Param('id') id: string) {
        const { affected }: DeleteResult = await this.regionServices.remove(id);
        if (affected === 1) {
            return null;
        } else {
            throw new InternalServerErrorException();
        }
    }
}
