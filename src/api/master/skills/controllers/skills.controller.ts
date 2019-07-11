import { Controller, Get, Post, Body, Delete, Param, Put } from '@nestjs/common';
import { SkillService } from '../services/skill.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import ResponseUtil from 'src/libraries/response/response.util';
import { SkillDTO, SkillPageResponse, SkillResponse } from '../models/skill.dto';
import Skill from '../models/skill.entity';
import { DeleteResult } from 'typeorm';

@Controller('skills')
@ApiUseTags('Skills')
export class SkillsController {

    constructor(private responseUtils: ResponseUtil, private skillService: SkillService) { }

    @Get()
    @ApiOperation({ title: 'GET Skills', description: 'API Get list of skills' })
    async get(): Promise<SkillPageResponse> {
        const skills: Skill[] = await this.skillService.findAll();
        return this.responseUtils.rebuildPagedResponse(skills);
    }

    @Post()
    @ApiOperation({ title: 'CREATE Skill', description: 'API Insert skill' })
    async insert(@Body() skillDto: SkillDTO): Promise<SkillResponse> {
        const skill: Skill = await this.skillService.create(skillDto);
        return this.responseUtils.rebuildResponse(skill);
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Skill', description: 'API UPDATE skill' })
    async update(@Param('id') id: number, @Body() skillDto: SkillDTO): Promise<SkillResponse> {
        const skill: Skill = await this.skillService.update(id, skillDto);
        return this.responseUtils.rebuildResponse(skill);
    }

    @Delete(':id')
    @ApiOperation({ title: 'DELETE Skill', description: 'API Delete skill' })
    async delete(@Param('id') id: number) {
        const skill: DeleteResult = await this.skillService.remove(id);
        return this.responseUtils.rebuildResponse(skill);
    }
}
