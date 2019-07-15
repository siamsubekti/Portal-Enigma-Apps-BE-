import { Controller, Get, Logger, Post, Body, Param, Put, Delete, UseInterceptors } from '@nestjs/common';
import { MajorService } from '../services/major.service';
import { ApiUseTags, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiImplicitParam, ApiOkResponse, ApiInternalServerErrorResponse, ApiResponse } from '@nestjs/swagger';
import { MajorPagedResponse, MajorResponse, MajorDTO, MajorResponseDTO } from '../models/major.dto';
import ResponseUtil from '../../../libraries/responses/response.util';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import Major from '../models/major.entity';
import { ResponseRebuildInterceptor } from 'src/libraries/responses/response.interceptor';

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
    @UseInterceptors(ResponseRebuildInterceptor)
    async listAcademies(): Promise<Major[]> {
        const major: Major[] = await this.majorService.getMajors();
        return major;
    }

    @Post('create')
    @ApiOperation({title: 'Create Major', description: 'Create Major'})
    @ApiCreatedResponse({description: 'Major successfuly created.', type: MajorResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async addAcademy(@Body() form: MajorDTO): Promise<Major> {
        const major: Major = await this.majorService.insertMajor(form);
        return major;
    }

    @Get(':id')
    @ApiOperation({title: 'Detail Major', description: 'Detail Major'})
    @ApiImplicitParam({name: 'id'})
    @ApiResponse({status: 202, description: 'Get role by id', type: MajorResponse })
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async getAcademyById(@Param('id') id: number): Promise<Major> {
        const major: Major = await this.majorService.getDetailMajor(id);
        Logger.log(major);
        return major;
    }

    @Put(':id')
    @ApiOperation({title: 'Update Major', description: 'Update Major'})
    @ApiOkResponse({description: 'Updated Major Success', type: MajorResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async updateAcademy(@Param('id') id: number, @Body() form: MajorDTO): Promise<Major> {
        const major: Major = await this.majorService.update(id, form);
        return major;
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
