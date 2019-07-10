import { Controller, Get, Post, Body, Delete, HttpException, HttpStatus, Param } from '@nestjs/common';
import { RegionService } from '../services/region.service';
import ResponseUtil from 'src/libraries/response/response.util';
import { ApiUseTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { async } from 'rxjs/internal/scheduler/async';
import { RegionDTO } from '../models/region.dto';

@Controller('regions')
export class RegionController {

    constructor(
        private readonly regionServices : RegionService,
        private readonly responseUtils : ResponseUtil
    ) { }

    @Get()
    @ApiUseTags('Regions')
    @ApiOperation({title: 'GET Regions', description: 'API Get list of regions'})
    // @ApiOkResponse({description: 'List of regions'})
    async get(){
        const regions = await this.regionServices.findAll();
        return this.responseUtils.rebuildPagedResponse(regions);
    }

    @Post()
    @ApiUseTags('Regions')
    @ApiOperation({title: 'CREATE Region', description: 'API create regions'})
    async insert(@Body() regionDto: RegionDTO){
        const region = await this.regionServices.create(regionDto);
        return this.responseUtils.rebuildResponse(region);
    }

    @Delete(':id')
    @ApiUseTags('Regions')
    @ApiOperation({title: 'DELETE Region', description: 'API delete region'})
    async delete(@Param() id){
        try {
            const region = await this.regionServices.remove(id);
            return this.responseUtils.rebuildResponse(region);
        } catch (error) {
            throw new HttpException('Failed to delete region', HttpStatus.NOT_FOUND);
            
        }

    }
}
