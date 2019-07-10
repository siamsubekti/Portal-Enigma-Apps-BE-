import { Controller, Get, Post, Body, Delete, Param, HttpException, HttpStatus } from '@nestjs/common';
import { SkillService } from '../services/skill.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import ResponseUtil from 'src/libraries/response/response.util';
import { async } from 'rxjs/internal/scheduler/async';
import { SkillDTO } from '../models/skill.dto';

@Controller('skills')
export class SkillsController {

    constructor(private responseUtils: ResponseUtil, private skillService: SkillService) { }

    @Get()
    @ApiUseTags('Skills')
    @ApiOperation({ title: 'GET Skills', description: 'API Get list of skills' })
    async get() {
        const skills = await this.skillService.findAll();
        return this.responseUtils.rebuildPagedResponse(skills);
    }

    @Post()
    @ApiUseTags('Skills')
    @ApiOperation({ title: 'CREATE Skill', description: 'API Insert skill' })
    async insert(@Body() skillDto: SkillDTO) {
        try {
            const skill = this.skillService.create(skillDto);
            return this.responseUtils.rebuildResponse(skill);
        } catch (error) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Delete(':id')
    @ApiUseTags('Skills')
    @ApiOperation({ title: 'DELETE Skill', description: 'API Delete skill' })
    async delete(@Param() id: number) {
        try {
            const skill = await this.skillService.remove(id);
            return this.responseUtils.rebuildResponse(skill);
        } catch (error) {
            throw new HttpException('Failed to delete skill', HttpStatus.NOT_FOUND);
        }
    }
}
