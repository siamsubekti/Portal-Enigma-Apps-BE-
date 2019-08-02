import { Controller, Get, Post, Body, Delete, Param, Put, InternalServerErrorException, HttpCode, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import SkillService from '../services/skill.service';
import { ApiUseTags, ApiOperation, ApiBadRequestResponse, ApiOkResponse, ApiNotFoundResponse, ApiCreatedResponse, ApiUnauthorizedResponse, ApiImplicitQuery } from '@nestjs/swagger';
import { SkillDTO, SkillPageResponse, SkillResponse, SkillResponses } from '../models/skill.dto';
import Skill from '../models/skill.entity';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import AppConfig from '../../../../config/app.config';
import { PagingData } from '../../../../libraries/responses/response.class';

@Controller('skills')
@ApiUseTags('Skills')
@UseGuards(CookieAuthGuard)
export default class SkillsController {

    constructor(
        private readonly skillService: SkillService,
        private readonly config: AppConfig,
    ) { }

    @Get()
    @ApiOperation({ title: 'List of Services', description: 'API search services' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'If success get list of Services', type: SkillPageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async find(
        @Query('term') term?: string,
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page: number = 1,
    ): Promise<SkillResponses> {
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.skillService.search({ term, sort, page, rowsPerPage });
        const paging: PagingData = {
            page,
            rowsPerPage,
            totalPages: Math.ceil(totalRows / rowsPerPage),
            totalRows,
        };

        return { data, paging };
    }

    @Get('search')
    @ApiOperation({ title: 'Search Skills', description: 'API search Skills by keywords' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'If success serach Skills', type: SkillPageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async search(
        @Query('term') term?: string,
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<SkillResponses> {
        const { result: data = [] } = await this.skillService.search({ term, sort });

        return { data };
    }

    @Get(':id')
    @ApiOperation({ title: 'Get a Skill', description: 'API Get skill by id.' })
    @ApiOkResponse({ description: 'Success to get skill by id.', type: SkillResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getById(@Param('id') id: number): Promise<Skill> {
        const skill: Skill = await this.skillService.findById(id);
        return skill;
    }

    @Post()
    @ApiOperation({ title: 'Create Skill', description: 'API Insert skill' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiCreatedResponse({ description: 'Success to create skill.', type: SkillResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() skillDto: SkillDTO): Promise<Skill> {
        const skill: Skill = await this.skillService.create(skillDto);
        return skill;
    }

    @Put(':id')
    @ApiOperation({ title: 'Update Skill', description: 'API UPDATE skill' })
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
    @ApiOperation({ title: 'Delete Skill', description: 'API Delete skill' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    async delete(@Param('id') id: number): Promise<any> {
        const { affected }: DeleteResult = await this.skillService.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }
}
