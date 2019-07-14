import { Controller, Get, Logger, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MajorService } from '../services/major.service';
import { ApiUseTags, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiImplicitParam, ApiOkResponse, ApiInternalServerErrorResponse, ApiResponse } from '@nestjs/swagger';
import { MajorPagedResponse, MajorResponse, MajorDTO, MajorResponseDTO } from '../models/major.dto';
import ResponseUtil from '../../../libraries/responses/response.util';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';

@ApiUseTags('Majors')
@Controller('majors')
export class MajorController {
    constructor(
        private readonly majorService: MajorService,
        private responseUtil: ResponseUtil) {}

    @Get('list')
    @ApiOperation({title: 'List Majors', description: 'All Majors'})
    @ApiOkResponse({description: 'Ok', type: MajorPagedResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async listAcademies(): Promise<MajorPagedResponse> {
        const data = await this.majorService.getMajors();
        Logger.log(data);
        return this.responseUtil.rebuildPagedResponse(data);
    }

    @Post('create')
    @ApiOperation({title: 'Create Major', description: 'Create Major'})
    @ApiCreatedResponse({description: 'Major successfuly created.', type: MajorResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiBadRequestResponse({description: 'Code has been use'})
    @ApiBadRequestResponse({description: 'Phone has been use'})
    async addAcademy(@Body() form: MajorDTO): Promise<MajorResponse> {
        const academy: MajorResponseDTO = await this.majorService.insertMajor(form);
        return this.responseUtil.rebuildResponse(academy, {code: '201', description: 'Created.'});
    }

    @Get(':id')
    @ApiOperation({title: 'Detail Major', description: 'Detail Major'})
    @ApiImplicitParam({name: 'id'})
    @ApiResponse({status: 202, description: 'Get role by id', type: MajorResponse })
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async getAcademyById(@Param('id') id: number): Promise<MajorResponse> {
        const academy: MajorResponseDTO = await this.majorService.getDetailMajor(id);
        Logger.log(academy);
        return this.responseUtil.rebuildResponse(academy, {code: '202', description: 'Get academy by id'});
    }

    @Put(':id')
    @ApiOperation({title: 'Update Major', description: 'Update Major'})
    @ApiOkResponse({description: 'Updated Major Success', type: MajorResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async updateAcademy(@Param('id') id: number, @Body() form: MajorDTO): Promise<MajorResponse> {
        const academy: MajorResponseDTO = await this.majorService.update(id, form);
        return this.responseUtil.rebuildResponse(academy, {code: '200', description: 'Update Success'});
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete Major', description: 'Delete Major'})
    @ApiOkResponse({description: 'Ok'})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async DeleteAcademy(@Param('id') id: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.majorService.delete(id);
        Logger.log(affected);
        if (affected === 1) return null;
    }
}
