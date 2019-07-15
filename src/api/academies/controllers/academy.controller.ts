import { AcademyService } from '../services/academy.service';
import ResponseUtil from '../../../libraries/responses/response.util';
import { Controller, Get, Body, Post, Logger, Param, Put, Delete } from '@nestjs/common';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitParam, ApiCreatedResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { AcademyResponse, AcademyResponseDTO, AcademyDTO, AcademiesPagedResponse } from '../models/academy.dto';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import Academy from '../models/academy.entity';

@ApiUseTags('Academies')
@Controller('academies')
export class AcademyController {
    constructor(
    private academieService: AcademyService,
    private responseUtil: ResponseUtil ) {}

    @Get('list')
    @ApiOperation({title: 'List Academies', description: 'All Academies'})
    @ApiResponse({status: 200, description: 'Ok', type: AcademiesPagedResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async listAcademies(): Promise<AcademiesPagedResponse> {
        const academy: AcademyDTO[] = await this.academieService.getAcademies();
        return this.responseUtil.rebuildPagedResponse(academy);
    }

    @Post('create')
    @ApiOperation({title: 'Create Academy', description: 'Create Academy'})
    @ApiCreatedResponse({description: 'Academy successfuly created.', type: AcademyResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiBadRequestResponse({description: 'Code has been use'})
    @ApiBadRequestResponse({description: 'Phone has been use'})
    async addAcademy(@Body() form: AcademyDTO): Promise<AcademyResponse> {
        const academy: AcademyResponseDTO = await this.academieService.insertAcademy(form);
        return this.responseUtil.rebuildResponse(academy, {code: '201', description: 'Created.'});
    }

    @Get(':id')
    @ApiOperation({title: 'Detail Academy', description: 'Detail Academy'})
    @ApiImplicitParam({name: 'id'})
    @ApiResponse({status: 202, description: 'Ok', type: AcademyResponse })
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async getAcademyById(@Param('id') id: number): Promise<AcademyResponse> {
        const academy: AcademyResponseDTO = await this.academieService.getAcademy(id);
        Logger.log(academy);
        return this.responseUtil.rebuildResponse(academy, {code: '200', description: 'Get academy by id'});
    }

    @Put(':id')
    @ApiOperation({title: 'Update Academy', description: 'Update Academy'})
    @ApiResponse({status: 200, description: 'Updated Success', type: AcademyResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async updateAcademy(@Param('id') id: number, @Body() form: AcademyDTO): Promise<AcademyResponse> {
        const academy: AcademyResponseDTO = await this.academieService.update(id, form);
        return this.responseUtil.rebuildResponse(academy, {code: '200', description: 'Update Success'});
    }

    @Delete(':id')
    @ApiOkResponse({description: 'Ok'})
    @ApiOperation({title: 'Delete Academy', description: 'Delete Academy'})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    async DeleteAcademy(@Param('id') id: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.academieService.delete(id);
        Logger.log(affected);
        if (affected === 1) return null;
    }
}
