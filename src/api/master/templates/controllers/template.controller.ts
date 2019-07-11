import { Controller, Get, Post, Body, Delete, Param, Put, HttpStatus } from '@nestjs/common';
import ResponseUtil from 'src/libraries/response/response.util';
import { TemplateService } from '../services/template.service';
import { ApiUseTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TemplateDTO, TemplatePageResponse, TemplateResponse } from '../models/template.dto';
import Template from '../models/template.entity';

@Controller('templates')
@ApiUseTags('Templates')
export class TemplateController {

    constructor(private responseUtils: ResponseUtil, private templateService: TemplateService) { }

    @Get()
    @ApiResponse({status: HttpStatus.OK, type: TemplateDTO})
    @ApiResponse({status: HttpStatus.INTERNAL_SERVER_ERROR})
    @ApiOperation({ title: 'GET Templates', description: 'API get list og templates' })
    async get(): Promise<TemplatePageResponse> {
        const templates: Template[] = await this.templateService.findAll();
        return this.responseUtils.rebuildPagedResponse(templates);
    }

    @Post()
    @ApiOperation({ title: 'CREATE Template', description: 'API insert into templates' })
    async insert(@Body() templateDto: TemplateDTO): Promise<TemplateResponse> {
        const template: Template = await this.templateService.create(templateDto);
        return this.responseUtils.rebuildResponse(template);
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Template', description: 'API Update template' })
    async update(@Param('id') id: number, @Body() templateDto: TemplateDTO): Promise<TemplateResponse> {
        const template: Template = await this.templateService.update(id, templateDto);
        return this.responseUtils.rebuildResponse(template);
    }

    @Delete(':id')
    @ApiOperation({ title: 'DELETE Template', description: 'API delete template' })
    async delete(@Param('id') id: number) {
        const template = await this.templateService.remove(id);
        return this.responseUtils.rebuildResponse(template);
    }
}
