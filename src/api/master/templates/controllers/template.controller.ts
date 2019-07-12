import { Controller, Get, Post, Body, Delete, Param, Put, HttpStatus, InternalServerErrorException, HttpCode } from '@nestjs/common';
import ResponseUtil from 'src/libraries/responses/response.util';
import { TemplateService } from '../services/template.service';
import { ApiUseTags, ApiOperation, ApiResponse, ApiBadRequestResponse, ApiOkResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { TemplateDTO, TemplatePageResponse, TemplateResponse } from '../models/template.dto';
import Template from '../models/template.entity';
import { ApiExceptionResponse } from 'src/libraries/responses/response.type';

@Controller('templates')
@ApiUseTags('Templates')
export class TemplateController {

    constructor(private responseUtils: ResponseUtil, private templateService: TemplateService) { }

    @Get()
    @ApiOperation({ title: 'GET Templates', description: 'API get list og templates' })
    @ApiOkResponse({ description: 'Success to get list fo templates.', type: TemplatePageResponse })
    @ApiInternalServerErrorResponse({ description: 'If internal server error', type: ApiExceptionResponse })
    async get(): Promise<TemplatePageResponse> {
        const templates: Template[] = await this.templateService.findAll();
        return this.responseUtils.rebuildPagedResponse(templates);
    }

    @Post()
    @ApiOperation({ title: 'CREATE Template', description: 'API insert into templates' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to create template.', type: TemplateResponse })
    async insert(@Body() templateDto: TemplateDTO): Promise<TemplateResponse> {
        const template: Template = await this.templateService.create(templateDto);
        return this.responseUtils.rebuildResponse(template);
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Template', description: 'API Update template' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to update template.', type: TemplateResponse })
    async update(@Param('id') id: number, @Body() templateDto: TemplateDTO): Promise<TemplateResponse> {
        const template: Template = await this.templateService.update(id, templateDto);
        return this.responseUtils.rebuildResponse(template);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Template', description: 'API delete template' })
    async delete(@Param('id') id: number) {
        const { affected } = await this.templateService.remove(id);
        // return this.responseUtils.rebuildResponse(template);
        if (affected === 1) {
            return null;
        } else {
            throw new InternalServerErrorException();
        }
    }
}
