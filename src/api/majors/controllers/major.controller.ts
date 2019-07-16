import { Controller, Get, Logger, Post, Body, Param, Put, Delete, UseInterceptors } from '@nestjs/common';
import { MajorService } from '../services/major.service';
import { ApiUseTags, ApiOperation, ApiCreatedResponse, ApiImplicitParam,
        ApiOkResponse, ApiInternalServerErrorResponse, ApiResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { MajorPagedResponse, MajorResponse, MajorDTO } from '../models/major.dto';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import { ResponseRebuildInterceptor } from 'src/libraries/responses/response.interceptor';

@ApiUseTags('Majors')
@Controller('majors')
export class MajorController {
    constructor(
        private readonly majorService: MajorService) {}

    @Get('list')
    @ApiOperation({title: 'List Majors', description: 'All Majors'})
    @ApiOkResponse({description: 'List Majors', type: MajorPagedResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async listAcademies(): Promise<MajorDTO[]> {
        const major: MajorDTO[] = await this.majorService.getMajors();
        return major;
    }

    @Post('create')
    @ApiOperation({title: 'Create Major', description: 'Create Major'})
    @ApiCreatedResponse({description: 'Major successfuly created.', type: MajorResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async addAcademy(@Body() form: MajorDTO): Promise<MajorDTO> {
        const major: MajorDTO = await this.majorService.insertMajor(form);
        return major;
    }

    @Get(':id')
    @ApiOperation({title: 'Detail Major', description: 'Detail Major'})
    @ApiImplicitParam({name: 'id'})
    @ApiOkResponse({description: 'Detail Major', type: MajorResponse })
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Major Not Found', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async getAcademyById(@Param('id') id: number): Promise<MajorDTO> {
        const major: MajorDTO = await this.majorService.getDetailMajor(id);
        Logger.log(major);
        return major;
    }

    @Put(':id')
    @ApiOperation({title: 'Update Major', description: 'Update Major'})
    @ApiResponse({status: 200, description: 'Updated Success', type: MajorResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Major Not Found', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async updateAcademy(@Param('id') id: number, @Body() form: MajorDTO): Promise<MajorDTO> {
        const major: MajorDTO = await this.majorService.update(id, form);
        return major;
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete Major', description: 'Delete Major'})
    @ApiNotFoundResponse({description: 'Major Not Found', type: ApiExceptionResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async DeleteAcademy(@Param('id') id: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.majorService.delete(id);
        Logger.log(affected);
        if (affected === 1) return null;
    }
}
