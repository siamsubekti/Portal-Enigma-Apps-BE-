import { Injectable, Logger, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Skill from '../models/skill.entity';
import { Repository, DeleteResult } from 'typeorm';
import { SkillDTO } from '../models/skill.dto';

@Injectable()
export class SkillService {

    constructor(@InjectRepository(Skill) private skillRepository: Repository<Skill>) { }

    async findAll(): Promise<Skill[]> {
        return await this.skillRepository.find();
    }

    async findById(id: number): Promise<Skill> {
        return await this.skillRepository.findOne(id);
    }

    async create(skillDto: SkillDTO): Promise<Skill> {
        const skill: Skill = await this.skillRepository.findOne({
            where: { name: skillDto.name },
        });
        if (skill) throw new BadRequestException('Data ini telah ada');
        else return await this.skillRepository.save(skillDto);
    }

    async remove(id: number): Promise<DeleteResult> {
        const isExist: boolean = await this.skillRepository.count({ id }) > 0;
        if (!isExist) throw new NotFoundException(`Skill with id: ${id} not found`);
        else return await this.skillRepository.delete(id);
    }

    async update(id: number, skillDto: SkillDTO): Promise<Skill> {
        let data: Skill = await this.skillRepository.findOne({
            where: { id },
        });
        if (!data) throw new NotFoundException(`Skill with id: ${id} not found`);
        else {
            const exist: boolean = await this.skillRepository.count({ where: { name: skillDto.name } }) === 1;
            if (exist && skillDto.name !== data.name) throw new BadRequestException('Data ini telah ada.');
            data = this.skillRepository.merge(data, skillDto);
            return await this.skillRepository.save(data);
        }
    }
}
