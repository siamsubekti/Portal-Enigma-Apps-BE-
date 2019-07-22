import { Controller, Get, InternalServerErrorException, Post, Put, Delete, HttpCode, Param, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { ParameterService } from '../services/parameter.service';
import ParameterDTO, { ParameterResponse, ParameterPageResponse } from '../models/parameter.dto';
import Parameter from '../models/parameter.entity';
import { ApiOkResponse, ApiOperation, ApiUseTags, ApiBadRequestResponse, ApiNotFoundResponse, ApiCreatedResponse } from '@nestjs/swagger';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import ResponseRebuildInterceptor from '../../../../libraries/responses/response.interceptor';
import { ApiExceptionResponse } from 'src/libraries/responses/response.type';

@Controller('parameters')
@ApiUseTags('Parameters')
// @UseGuards(CookieAuthGuard)
export class ParameterController {

    constructor(
        private readonly parameterService: ParameterService,
    ) { }

    @Get(':key')
    @ApiOperation({ title: 'GET Parameters by key', description: 'API to get value of parameter by key' })
    async get(@Param('key') key: string): Promise<string> {
        const value: string = await this.parameterService.get(key);
        return value;
    }

    @Get()
    @ApiOperation({ title: 'GET Parameters', description: 'API to get list Parameters' })
    @ApiOkResponse({ description: 'If success to get list Parameters', type: ParameterPageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getAll(): Promise<Parameter[]> {
        const parameters: Parameter[] = await this.parameterService.findAll();
        return parameters;
    }

    @Post()
    @ApiOperation({ title: 'CREATE Parameter', description: 'API to create Parameter' })
    @ApiCreatedResponse({ description: 'If success insert parameter', type: ParameterResponse })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() parameterDto: ParameterDTO): Promise<Parameter> {
        const parameter: Parameter = await this.parameterService.create(parameterDto);
        return parameter;
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Parameter', description: 'API to update Parameter' })
    @ApiOkResponse({ description: 'If success update Parameter', type: ParameterResponse })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async update(@Param('id') id: number, @Body() parameterDto: ParameterDTO): Promise<Parameter> {
        const parameter: Parameter = await this.parameterService.update(id, parameterDto);
        return parameter;
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Paramter', description: 'API to delete Parameter' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    async delete(@Param('id') id: number): Promise<any> {
        const { affected } = await this.parameterService.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }
}
