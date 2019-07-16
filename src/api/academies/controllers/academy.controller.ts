import { AcademyService } from '../services/academy.service';
import ResponseUtil from '../../../libraries/responses/response.util';
import { Controller, Get, Body, Post, Logger, Param, Put, Delete, UseInterceptors } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiImplicitParam,
        ApiCreatedResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse,
        ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { AcademyResponse, AcademyDTO, AcademiesPagedResponse } from '../models/academy.dto';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import { ResponseRebuildInterceptor } from '../../../libraries/responses/response.interceptor';

@ApiUseTags('Academies')
@Controller('academies')
export class AcademyController {
    constructor(
    private academieService: AcademyService ) {}

    @Get('list')
    @ApiOperation({title: 'List Academies', description: 'All Academies'})
    @ApiOkResponse({description: 'List Academies', type: AcademiesPagedResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async listAcademies(): Promise<AcademyDTO[]> {
        const academy: AcademyDTO[] = await this.academieService.getAcademies();
        Logger.log(academy);
        return academy;
    }

    @Post('create')
    @ApiOperation({title: 'Create Academy', description: 'Create Academy'})
    @ApiCreatedResponse({description: 'Academy successfuly created.', type: AcademyResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiBadRequestResponse({description: 'Code has been use', type: ApiExceptionResponse})
    @ApiBadRequestResponse({description: 'Phone has been use', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async addAcademy(@Body() form: AcademyDTO): Promise<AcademyDTO> {
        const academy: AcademyDTO = await this.academieService.insertAcademy(form);
        Logger.log(academy);
        return academy;
    }

    @Get(':id')
    @ApiOperation({title: 'Detail Academy', description: 'Detail Academy'})
    @ApiImplicitParam({name: 'id'})
    @ApiOkResponse({description: 'Detail Academy', type: AcademyResponse })
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Academy Not Found', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async getAcademyById(@Param('id') id: number): Promise<AcademyDTO> {
        const academy: AcademyDTO = await this.academieService.getAcademy(id);
        Logger.log(academy);
        return academy;
    }

    @Put(':id')
    @ApiOperation({title: 'Update Academy', description: 'Update Academy'})
    @ApiOkResponse({description: 'Updated Success', type: AcademyResponse})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Academy Not Found', type: ApiExceptionResponse})
    @UseInterceptors(ResponseRebuildInterceptor)
    async updateAcademy(@Param('id') id: number, @Body() form: AcademyDTO): Promise<AcademyDTO> {
        const academy: AcademyDTO = await this.academieService.update(id, form);
        Logger.log(academy);
        return academy;
    }

    @Delete(':id')
    @ApiOperation({title: 'Delete Academy', description: 'Delete Academy'})
    @ApiInternalServerErrorResponse({description: 'Internal Server Error', type: ApiExceptionResponse})
    @ApiNotFoundResponse({description: 'Academy Not Found', type: ApiExceptionResponse})
    async DeleteAcademy(@Param('id') id: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.academieService.delete(id);
        Logger.log(affected);
        if (affected === 1) return null;
    }
}
