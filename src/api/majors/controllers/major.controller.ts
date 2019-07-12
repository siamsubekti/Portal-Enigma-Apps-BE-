import { Controller, Get, Logger, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MajorService } from '../services/major.service';
import { ApiUseTags, ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiImplicitParam, ApiOkResponse } from '@nestjs/swagger';
import { MajorPagedResponse, MajorResponse, MajorDTO, MajorResponseDTO } from '../models/major.dto';
import ResponseUtil from '../../../libraries/responses/response.util';
import { DeleteResult } from 'typeorm';

@ApiUseTags('Majors')
@Controller('majors')
export class MajorController {
    constructor(
        private readonly majorService: MajorService,
        private responseUtil: ResponseUtil) {}

    @Get('list')
    @ApiOperation({title: 'List majors', description: 'All majors'})
    @ApiOkResponse({description: 'Ok', type: MajorPagedResponse})
    async listAcademies(): Promise<MajorPagedResponse> {
        const data = await this.majorService.getMajors();
        Logger.log(data);
        return this.responseUtil.rebuildPagedResponse(data);
    }

    @Post('add')
    @ApiOperation({title: 'Add major', description: 'Add major'})
    @ApiCreatedResponse({description: 'Academy successfuly created.', type: MajorResponse})
    @ApiBadRequestResponse({description: 'Code has been use'})
    @ApiBadRequestResponse({description: 'Phone has been use'})
    async addAcademy(@Body() form: MajorDTO): Promise<MajorResponse> {
        const academy: MajorResponseDTO = await this.majorService.insertMajor(form);
        return this.responseUtil.rebuildResponse(academy, {code: '201', description: 'Created.'});
    }

    @Get('detail/:id')
    @ApiImplicitParam({name: 'id'})
    @ApiOperation({title: 'Detail Major', description: 'Detail Major'})
    @ApiOkResponse({description: 'Ok', type: MajorResponse })
    async getAcademyById(@Param('id') id: number): Promise<MajorResponse> {
        const academy: MajorResponseDTO = await this.majorService.getDetailMajor(id);
        Logger.log(academy);
        return this.responseUtil.rebuildResponse(academy, {code: '200', description: 'Get academy by id'});
    }

    @Put('major/:id')
    @ApiOkResponse({description: 'Updated Success', type: MajorResponse})
    async updateAcademy(@Param('id') id: number, @Body() form: MajorDTO): Promise<MajorResponse> {
        const academy: MajorResponseDTO = await this.majorService.update(id, form);
        return this.responseUtil.rebuildResponse(academy, {code: '200', description: 'Update Success'});
    }

    @Delete(':id')
    @ApiOkResponse({description: 'Ok'})
    async DeleteAcademy(@Param('id') id: number): Promise<DeleteResult> {
        const {affected}: DeleteResult = await this.majorService.delete(id);
        Logger.log(affected);
        if (affected === 1) return null;
    }
}
