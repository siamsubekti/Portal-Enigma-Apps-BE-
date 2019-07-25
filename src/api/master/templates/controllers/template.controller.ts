import { Controller, Get, Post, Body, Delete, Param, Put, InternalServerErrorException, HttpCode, UseInterceptors, UseGuards } from '@nestjs/common';
import { TemplateService } from '../services/template.service';
import { ApiUseTags, ApiOperation, ApiBadRequestResponse, ApiOkResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiCreatedResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { TemplateDTO, TemplatePageResponse, TemplateResponse } from '../models/template.dto';
import Template from '../models/template.entity';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';

@Controller('templates')
@ApiUseTags('Templates')
@UseGuards(CookieAuthGuard)
export class TemplateController {

    constructor(private templateService: TemplateService) { }

    @Get()
    @ApiOperation({ title: 'GET Templates', description: 'API get list og templates' })
    @ApiOkResponse({ description: 'Success to get list fo templates.', type: TemplatePageResponse })
    @ApiInternalServerErrorResponse({ description: 'If internal server error', type: ApiExceptionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async get(): Promise<Template[]> {
        const templates: Template[] = await this.templateService.findAll();
        return templates;
    }

    @Get(':id')
    @ApiOperation({ title: 'GET Template By Id', description: 'API Get template by id.' })
    @ApiOkResponse({ description: 'Success to get template by id.', type: TemplateResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getById(@Param('id') id : number ): Promise<Template> {
        const template : Template = await this.templateService.findById(id);
        return template;
    }

    @Post()
    @ApiOperation({ title: 'CREATE Template', description: 'API insert into templates' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiCreatedResponse({ description: 'Success to create template.', type: TemplateResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() templateDto: TemplateDTO): Promise<Template> {
        const template: Template = await this.templateService.create(templateDto);
        return template;
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Template', description: 'API Update template' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to update template.', type: TemplateResponse })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async update(@Param('id') id: number, @Body() templateDto: TemplateDTO): Promise<Template> {
        const template: Template = await this.templateService.update(id, templateDto);
        return template;
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Template', description: 'API delete template' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    async delete(@Param('id') id: number): Promise<any> {
        const { affected }: any = await this.templateService.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }
}
