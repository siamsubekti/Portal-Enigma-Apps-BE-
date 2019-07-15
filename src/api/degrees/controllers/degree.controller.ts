import { DegreeService } from '../services/degree.service';
import { DegreePagedResponse, DegreeResponse, DegreeDTO, DegreeResponseDTO } from '../models/degree.dto';
import ResponseUtil from '../../../libraries/responses/response.util';
import { Get, Controller, Param, Post, Body, Delete, Put, Logger } from '@nestjs/common';
import { ApiUseTags, ApiOkResponse, ApiInternalServerErrorResponse, ApiCreatedResponse, ApiAcceptedResponse, ApiOperation } from '@nestjs/swagger';
import { ApiExceptionResponse, ApiResponse } from '../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';

@ApiUseTags('Degrees')
@Controller('degrees')
export class DegreeController {
    constructor(
        private readonly degreeService: DegreeService,
        private readonly responseUtil: ResponseUtil,
    ) {}

    @Get('list')
    @ApiOperation({title: 'List Degrees', description: 'All Degrees'})
    @ApiOkResponse({description: 'List Degrees', type: DegreePagedResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async listDegrees(): Promise<DegreePagedResponse> {
        const Degrees: DegreeResponseDTO[] = await this.degreeService.getDegrees();
        return this.responseUtil.rebuildPagedResponse(Degrees);
    }

    @Post('create')
    @ApiOperation({title: 'Create Degree', description: 'Create Degree'})
    @ApiCreatedResponse({description: 'Created', type: DegreeResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async newDegree(@Body() form: DegreeDTO): Promise<DegreeResponse> {
        const Degree: DegreeResponseDTO = await this.degreeService.insertDegree(form);
        return this.responseUtil.rebuildResponse(Degree, {code: '201', description: 'Created'});
    }

    @Get(':id')
    @ApiOperation({title: 'Detail Degree', description: 'Detail Degree'})
    @ApiOkResponse({description: 'Detail Degree', type: DegreeResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async DetailDegree(@Param('id') params: number): Promise<DegreeResponse> {
        const Degree: DegreeResponseDTO = await this.degreeService.getDegree(params);
        Logger.log(Degree);
        return this.responseUtil.rebuildResponse(Degree, {code: '202', description: 'Get major by id'});
    }

    @Put(':id')
    @ApiOperation({title: 'Update Degree', description: 'Update Degree'})
    @ApiOkResponse({description: 'Detail Degree', type: DegreeResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async updateDegree(@Param('id') params: number, @Body() form: DegreeDTO): Promise<DegreeResponse> {
        const degree: DegreeResponseDTO = await this.degreeService.updateDegree(params, form);
        return this.responseUtil.rebuildResponse(degree, {code: '200', description: 'Update Success'});
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete Degree', description: 'Delete Degree'})
    @ApiAcceptedResponse({description: 'Accepted', type: DeleteResult})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async removeDegree(@Param('id') params: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.degreeService.deleteDegree(params);
        if (affected === 1) return null;
    }
}
