import { DegreeService } from '../services/degree.service';
import { DegreePagedResponse, DegreeResponse, DegreeDTO, DegreeResponseDTO } from '../models/degree.dto';
import { Get, Controller, Param, Post, Body, Delete, Put, Logger, UseInterceptors, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiOkResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiOperation, ApiNotFoundResponse } from '@nestjs/swagger';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';

@UseGuards(CookieAuthGuard)
@ApiUseTags('Degrees')
@Controller('degrees')
export class DegreeController {
    constructor(
        private readonly degreeService: DegreeService,
    ) { }

    @Get('list')
    @ApiOperation({ title: 'List Degrees', description: 'All Degrees' })
    @ApiOkResponse({ description: 'OK', type: DegreePagedResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async listDegrees(): Promise<DegreeResponseDTO[]> {
        const degrees: DegreeResponseDTO[] = await this.degreeService.getDegrees();
        Logger.log(degrees);
        return degrees;
    }

    @Post('create')
    @ApiOperation({ title: 'Create Degree', description: 'Create Degree' })
    @ApiCreatedResponse({ description: 'OK', type: DegreeResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async newDegree(@Body() form: DegreeDTO): Promise<DegreeResponseDTO> {
        const degree: DegreeResponseDTO = await this.degreeService.insertDegree(form);
        Logger.log(degree);
        return degree;
    }

    @Get(':id')
    @ApiOperation({ title: 'Detail Degree', description: 'Detail Degree' })
    @ApiOkResponse({ description: 'OK', type: DegreeResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Degree Not Found', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async DetailDegree(@Param('id') params: number): Promise<DegreeResponseDTO> {
        const degree: DegreeResponseDTO = await this.degreeService.getDegree(params);
        Logger.log(degree);
        return degree;
    }

    @Put(':id')
    @ApiOperation({ title: 'Update Degree', description: 'Update Degree' })
    @ApiOkResponse({ description: 'OK', type: DegreeResponse })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Degree Not Found', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async updateDegree(@Param('id') params: number, @Body() form: DegreeDTO): Promise<DegreeResponseDTO> {
        const degree: DegreeResponseDTO = await this.degreeService.updateDegree(params, form);
        Logger.log(degree);
        return degree;
    }

    @Delete(':id')
    @ApiOperation({ title: 'Delete Degree', description: 'Delete Degree' })
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Degree Not Found', type: ApiExceptionResponse })
    async removeDegree(@Param('id') params: number): Promise<DeleteResult> {
        const { affected }: DeleteResult = await this.degreeService.deleteDegree(params);
        Logger.log({ affected });
        if (affected === 1) return null;
    }
}
