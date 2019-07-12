import { AcademyService } from '../services/academy.service';
import ResponseUtil from '../../../libraries/response/response.util';
import { Controller, Get, Body, Post, HttpException, HttpStatus, Logger, Param, Put, Delete, Res, NotFoundException } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam } from '@nestjs/swagger';
import Academy from '../models/academy.entity';
import AcademyDTO from '../models/academy.dto';
import { Any, DeleteResult } from 'typeorm';

@ApiUseTags('Academies')
@Controller('academy')
export class AcademyController {
    constructor(
    private academieService: AcademyService,
    private responseUtil: ResponseUtil ) {}

    @Get()
    @ApiResponse({
        status: 200,
        description: 'Ok',
        type: Academy,
    })
    @ApiOperation({title: 'Academies', description: 'API Academies Response'})
    async listAcademies() {
        const data = await this.academieService.getAcademies();
        Logger.log(data);
        return this.responseUtil.rebuildPagedResponse(data);
    }

    @Post()
    @ApiResponse({
        status: 201,
        description: 'Created',
        type: {Academy},
    })
    async addAcademy(@Body() academyDTO: AcademyDTO) {
        const data = await this.academieService.insertAcademy(academyDTO);
        Logger.log(data);
        return this.responseUtil.rebuildResponse(data);
    }

    @ApiImplicitParam({name: 'id'})
    @ApiResponse({
        status: 202,
        description: 'Ok',
        type: Any,
    })
    @Get(':id')
    async getAcademyById(@Param() id: number) {
        const academy: Academy = await this.academieService.getAcademy(id);
        Logger.log(academy);
        return this.responseUtil.rebuildResponse(academy);
    }

    @ApiImplicitParam({name: 'id'})
    @ApiResponse({
        status: 202,
        description: 'Updated Success',
        type: Academy,
    })
    @Put(':id')
    async updateAcademy(@Param() id: number, @Body() academyDTO: AcademyDTO) {
        const data = await this.academieService.update(id, academyDTO);
        Logger.log(data);
        return this.responseUtil.rebuildResponse(data);
    }

    @ApiImplicitParam({name: 'id'})
    @ApiResponse({
        status: 203,
        description: 'Deleted Success',
    })
    @Delete(':id')
    async DeleteAcademy(@Param() id: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.academieService.delete(id);
        Logger.log(affected);
        if (affected === 1) return null;
    }
}
