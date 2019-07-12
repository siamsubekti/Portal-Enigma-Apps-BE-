import { Injectable, Logger, HttpException, HttpStatus, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Skill from '../models/skill.entity';
import { Repository, DeleteResult } from 'typeorm';
import { SkillDTO } from '../models/skill.dto';

@Injectable()
export class SkillService {

    constructor(@InjectRepository(Skill) private skillRepository: Repository<Skill>) { }

    async findAll(): Promise<Skill[]> {
        try {
            const skills: Skill[] = await this.skillRepository.find();
            return skills;
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    async create(skillDto: SkillDTO): Promise<Skill> {
        const isExist: Skill = await this.skillRepository.findOne({
            where: {
                name: skillDto.name
            }
        });
        if (isExist) {
            throw new HttpException('Data ini telah ada', HttpStatus.BAD_REQUEST);
        } else {
            try {
                const skill: Skill = await this.skillRepository.save(skillDto);
                Logger.log(`Insert into skill with id : ${skill.id}`);
                return skill;
            } catch (error) {
                Logger.error(error);
                throw new InternalServerErrorException();
            }
        }
    }

    async remove(id: number): Promise<DeleteResult> {
        const isExist: boolean = await this.skillRepository.count({ id }) > 0;
        if (!isExist) {
            throw new NotFoundException(`Skill with id: ${id} not found`);
        } else {
            try {
                const skill: DeleteResult = await this.skillRepository.delete(id);
                return skill;
            } catch (error) {
                Logger.error(error);
                throw new InternalServerErrorException();
            }
        }
    }

    async update(id: number, skillDto: SkillDTO): Promise<Skill> {
        let data: Skill = await this.skillRepository.findOne({
            where: {
                id
            }
        });
        if (!data) {
            throw new NotFoundException(`Skill with id: ${id} not found`);
        } else {
            try {
                data = this.skillRepository.merge(data, skillDto);
                Logger.log(data);
                const skill: Skill = await this.skillRepository.save(data);
                return skill;
            } catch (error) {
                Logger.error(error);
                throw new InternalServerErrorException();
            }
        }
    }
}
