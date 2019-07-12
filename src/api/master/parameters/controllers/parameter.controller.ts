import { Controller, Get, InternalServerErrorException, Post, Put, Delete, HttpCode, Param, Body, UseGuards } from '@nestjs/common';
import { ParameterService } from '../services/parameter.service';
import ResponseUtil from 'src/libraries/responses/response.util';
import ParameterDTO, { ParameterResponse, ParameterPageResponse } from '../models/parameter.dto';
import Parameter from '../models/parameter.entity';
import { ApiOkResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';
import { CookieAuthGuard } from 'src/api/auth/guards/cookie.guard';

@Controller('parameters')
@ApiUseTags('Parameters')
// @UseGuards(CookieAuthGuard)
export class ParameterController {

    constructor(
        private readonly parameterService: ParameterService,
        private readonly responseUtil: ResponseUtil
    ) { }

    @Get(':key')
    @ApiOperation({ title: 'GET Parameters by key', description: 'API to get value of parameter by key' })
    async get(@Param('key') key: string): Promise<string> {
        const value = await this.parameterService.get(key);
        return value;
    }
    
    @Get()
    @ApiOperation({ title: 'GET Parameters', description: 'API to get list Parameters' })
    @ApiOkResponse({ description: 'If success to get list Parameters', type: ParameterPageResponse })
    async getAll(): Promise<ParameterPageResponse> {
        const parameters: Parameter[] = await this.parameterService.findAll();
        return this.responseUtil.rebuildPagedResponse(parameters);
    }

    @Post()
    @ApiOperation({ title: 'CREATE Parameter', description: 'API to create Parameter' })
    @ApiOkResponse({ description: 'If success insert parameter', type: ParameterResponse })
    async insert(@Body() parameterDto: ParameterDTO): Promise<ParameterResponse> {
        const parameter: Parameter = await this.parameterService.create(parameterDto);
        return this.responseUtil.rebuildResponse(parameter);
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Parameter', description: 'API to update Parameter' })
    @ApiOkResponse({ description: 'If success update Parameter', type: ParameterResponse })
    async update(id: number, parameterDto: ParameterDTO): Promise<ParameterResponse> {
        const parameter: Parameter = await this.parameterService.update(id, parameterDto);
        return this.responseUtil.rebuildResponse(parameter);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Paramter', description: 'API to delete Parameter' })
    async delete(id: number) {
        const { affected } = await this.parameterService.remove(id);
        if (affected === 1) {
            return null;
        } else {
            throw new InternalServerErrorException();
        }
    }

}


