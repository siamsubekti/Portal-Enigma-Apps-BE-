import { Controller, Get, Post, Body, Delete, Param, Put, InternalServerErrorException, HttpCode } from '@nestjs/common';
import { SkillService } from '../services/skill.service';
import { ApiUseTags, ApiOperation, ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import ResponseUtil from 'src/libraries/responses/response.util';
import { SkillDTO, SkillPageResponse, SkillResponse } from '../models/skill.dto';
import Skill from '../models/skill.entity';
import { DeleteResult } from 'typeorm';
import { ApiExceptionResponse } from 'src/libraries/responses/response.type';

@Controller('skills')
@ApiUseTags('Skills')
export class SkillsController {

    constructor(private responseUtils: ResponseUtil, private skillService: SkillService) { }

    @Get()
    @ApiOperation({ title: 'GET Skills', description: 'API Get list of skills' })
    @ApiOkResponse({ description: 'Success to get list skills.', type: SkillPageResponse })
    async get(): Promise<SkillPageResponse> {
        const skills: Skill[] = await this.skillService.findAll();
        return this.responseUtils.rebuildPagedResponse(skills);
    }

    @Post()
    @ApiOperation({ title: 'CREATE Skill', description: 'API Insert skill' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to create skill.', type: SkillResponse })
    async insert(@Body() skillDto: SkillDTO): Promise<SkillResponse> {
        const skill: Skill = await this.skillService.create(skillDto);
        return this.responseUtils.rebuildResponse(skill);
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Skill', description: 'API UPDATE skill' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to update skill.', type: SkillResponse })
    async update(@Param('id') id: number, @Body() skillDto: SkillDTO): Promise<SkillResponse> {
        const skill: Skill = await this.skillService.update(id, skillDto);
        return this.responseUtils.rebuildResponse(skill);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Skill', description: 'API Delete skill' })
    async delete(@Param('id') id: number) {
        const { affected }: DeleteResult = await this.skillService.remove(id);
        // return this.responseUtils.rebuildResponse(skill);
        if (affected === 1) {
            return null;
        } else {
            throw new InternalServerErrorException();
        }
    }
}
