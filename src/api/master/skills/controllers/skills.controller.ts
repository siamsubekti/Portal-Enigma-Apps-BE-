import { Controller, Get, Post, Body, Delete, Param, Put, InternalServerErrorException, HttpCode, UseInterceptors, UseGuards } from '@nestjs/common';
import SkillService from '../services/skill.service';
import { ApiUseTags, ApiOperation, ApiBadRequestResponse, ApiOkResponse, ApiNotFoundResponse, ApiCreatedResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SkillDTO, SkillPageResponse, SkillResponse } from '../models/skill.dto';
import Skill from '../models/skill.entity';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';

@Controller('skills')
@ApiUseTags('Skills')
@UseGuards(CookieAuthGuard)
export default class SkillsController {

    constructor(private skillService: SkillService) { }

    @Get()
    @ApiOperation({ title: 'GET Skills', description: 'API Get list of skills' })
    @ApiOkResponse({ description: 'Success to get list skills.', type: SkillPageResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async get(): Promise<Skill[]> {
        const skills: Skill[] = await this.skillService.findAll();
        return skills;
    }

    @Get(':id')
    @ApiOperation({ title: 'GET Skill By Id', description: 'API Get skill by id.' })
    @ApiOkResponse({ description: 'Success to get skill by id.', type: SkillResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getById(@Param('id') id: number): Promise<Skill> {
        const skill: Skill = await this.skillService.findById(id);
        return skill;
    }

    @Post()
    @ApiOperation({ title: 'CREATE Skill', description: 'API Insert skill' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiCreatedResponse({ description: 'Success to create skill.', type: SkillResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() skillDto: SkillDTO): Promise<Skill> {
        const skill: Skill = await this.skillService.create(skillDto);
        return skill;
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Skill', description: 'API UPDATE skill' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to update skill.', type: SkillResponse })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async update(@Param('id') id: number, @Body() skillDto: SkillDTO): Promise<Skill> {
        const skill: Skill = await this.skillService.update(id, skillDto);
        return skill;
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Skill', description: 'API Delete skill' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    async delete(@Param('id') id: number): Promise<any> {
        const { affected }: DeleteResult = await this.skillService.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }
}
