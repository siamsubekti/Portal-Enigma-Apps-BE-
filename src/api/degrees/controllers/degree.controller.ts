import { DegreeService } from '../services/degree.service';
import { DegreePagedResponse, DegreeResponse, DegreeDTO, DegreeResponseDTO } from '../models/degree.dto';
import ResponseUtil from '../../../libraries/responses/response.util';
import { Get, Controller, Param, Post, Body, Delete, Put, Logger, UseInterceptors } from '@nestjs/common';
import { ApiUseTags, ApiOkResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiOperation, ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiExceptionResponse, ApiResponse } from '../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';
import { ResponseRebuildInterceptor } from 'src/libraries/responses/response.interceptor';

@ApiUseTags('Degrees')
@Controller('degrees')
export class DegreeController {
    constructor(
        private readonly degreeService: DegreeService,
    ) {}

    @Get('list')
    @ApiOperation({title: 'List Degrees', description: 'All Degrees'})
    @ApiOkResponse({description: 'List Degrees', type: DegreePagedResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async listDegrees(): Promise<DegreeDTO[]> {
        const degrees: DegreeDTO[] = await this.degreeService.getDegrees();
        Logger.log(degrees);
        return degrees;
    }

    @Post('create')
    @ApiOperation({title: 'Create Degree', description: 'Create Degree'})
    @ApiCreatedResponse({description: 'Degree successfuly created.', type: DegreeResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async newDegree(@Body() form: DegreeDTO): Promise<DegreeDTO> {
        const degree: DegreeDTO = await this.degreeService.insertDegree(form);
        Logger.log(degree);
        return degree;
    }

    @Get(':id')
    @ApiOperation({title: 'Detail Degree', description: 'Detail Degree'})
    @ApiOkResponse({description: 'Detail Degree', type: DegreeResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Degree Not Found', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async DetailDegree(@Param('id') params: number): Promise<DegreeDTO> {
        const degree: DegreeDTO = await this.degreeService.getDegree(params);
        Logger.log(degree);
        return degree;
    }

    @Put(':id')
    @ApiOperation({title: 'Update Degree', description: 'Update Degree'})
    @ApiOkResponse({description: 'Updated Success', type: DegreeResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Degree Not Found', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async updateDegree(@Param('id') params: number, @Body() form: DegreeDTO): Promise<DegreeDTO> {
        const degree: DegreeDTO = await this.degreeService.updateDegree(params, form);
        Logger.log(degree);
        return degree;
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete Degree', description: 'Delete Degree'})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Degree Not Found', type: ApiExceptionResponse})
    async removeDegree(@Param('id') params: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.degreeService.deleteDegree(params);
        Logger.log({affected});
        if (affected === 1) return null;
    }
}
