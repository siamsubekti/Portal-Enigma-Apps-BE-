import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import ResponseUtil from 'src/libraries/response/response.util';
import { TemplateService } from '../services/template.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { async } from 'rxjs/internal/scheduler/async';
import { TemplateDTO } from '../models/template.dto';

@Controller('templates')
export class TemplateController {

    constructor(private responseUtils: ResponseUtil, private templateService: TemplateService){}

    @Get()
    @ApiUseTags('Templates')
    @ApiOperation({title: 'GET Templates', description: 'API get list og templates'})
    async get(){
        const templates = await this.templateService.findAll();
        return this.responseUtils.rebuildPagedResponse(templates);
    }

    @Post()
    @ApiUseTags('Templates')
    @ApiOperation({title: 'CREATE Template', description: 'API insert into templates'})
    async insert(@Body() templateDto: TemplateDTO){
        const template = await this.templateService.create(templateDto);
        return this.responseUtils.rebuildResponse(template);
    }

    @Delete(':id')
    @ApiUseTags('Templates')
    @ApiOperation({title: 'DELETE Template', description: 'API delete template'})
    async delete(@Param() id: number){
        const template = await this.templateService.remove(id);
        return this.responseUtils.rebuildResponse(template);
    }
}
