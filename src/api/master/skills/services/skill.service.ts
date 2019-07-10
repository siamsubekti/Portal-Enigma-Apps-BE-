import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Skill from '../models/skill.entity';
import { Repository, DeleteResult } from 'typeorm';
import { SkillDTO } from '../models/skill.dto';
let logger = new Logger;

@Injectable()
export class SkillService {

    constructor(@InjectRepository(Skill) private skillRepository: Repository<Skill>) { }

    async findAll(): Promise<Skill[]> {
        const skills = await this.skillRepository.find();
        return skills;
    }

    async create(skillDto: SkillDTO): Promise<Skill> {
        const skill = await this.skillRepository.save(skillDto);
        logger.log(`Insert into skill with id : ${skill.id}`);
        return skill;
    }

    async remove(id): Promise<DeleteResult> {
        const skill = await this.skillRepository.delete(id);
        if (skill.affected < 1) {
            throw new HttpException('Failed to delete skill', HttpStatus.NOT_FOUND);
        }
        return skill;
    }
}
