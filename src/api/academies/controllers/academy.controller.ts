import { AcademyService } from '../services/academy.service';
import ResponseUtil from '../../../libraries/responses/response.util';
import { Controller, Get, Body, Post, Logger, Param, Put, Delete } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AcademyResponse, AcademyResponseDTO, AcademyDTO, AcademiesPagedResponse } from '../models/academy.dto';
import { DeleteResult } from 'typeorm';

@ApiUseTags('Academies')
@Controller('academies')
export class AcademyController {
    constructor(
    private academieService: AcademyService,
    private responseUtil: ResponseUtil ) {}

    @Get('list')
    @ApiOperation({title: 'List academies', description: 'All academies'})
    @ApiResponse({status: 200, description: 'Ok', type: AcademiesPagedResponse})
    async listAcademies(): Promise<AcademiesPagedResponse> {
        const data = await this.academieService.getAcademies();
        Logger.log(data);
        return this.responseUtil.rebuildPagedResponse(data);
    }

    @Post('add')
    @ApiCreatedResponse({description: 'Academy successfuly created.', type: AcademyResponse})
    @ApiBadRequestResponse({description: 'Code has been use'})
    @ApiBadRequestResponse({description: 'Phone has been use'})
    async addAcademy(@Body() form: AcademyDTO): Promise<AcademyResponse> {
        const academy: AcademyResponseDTO = await this.academieService.insertAcademy(form);
        return this.responseUtil.rebuildResponse(academy, {code: '201', description: 'Created.'});
    }

    @Get('detail/:id')
    @ApiImplicitParam({name: 'id'})
    @ApiResponse({status: 202, description: 'Ok', type: AcademyResponse })
    async getAcademyById(@Param('id') id: number): Promise<AcademyResponse> {
        const academy: AcademyResponseDTO = await this.academieService.getAcademy(id);
        Logger.log(academy);
        return this.responseUtil.rebuildResponse(academy, {code: '200', description: 'Get academy by id'});
    }

    @ApiResponse({status: 200, description: 'Updated Success', type: AcademyResponse})
    @Put(':id')
    async updateAcademy(@Param('id') id: number, @Body() form: AcademyDTO): Promise<AcademyResponse> {
        const academy: AcademyResponseDTO = await this.academieService.update(id, form);
        return this.responseUtil.rebuildResponse(academy, {code: '200', description: 'Update Success'});
    }

    @ApiResponse({status: 200})
    @Delete(':id')
    async DeleteAcademy(@Param('id') id: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.academieService.delete(id);
        Logger.log(affected);
        if (affected === 1) return null;
    }
}
