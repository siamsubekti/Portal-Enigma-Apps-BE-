import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Skill from '../models/skill.entity';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { SkillDTO, SkillQueryDTO, SkillQueryResult } from '../models/skill.dto';

@Injectable()
export default class SkillService {

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

    async search(queryParams: SkillQueryDTO): Promise<SkillQueryResult> {
        let query: SelectQueryBuilder<Skill> = this.skillRepository.createQueryBuilder('skill');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('skill.name LIKE :term', { term })
                .orWhere('skill.description LIKE :term', { term });
        }

        if (queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            // const orderCols: { [key: string]: string } = {
            //     name: 'job.name',
            // };
            query = query.orderBy('skill.name', sort);
        } else
            query = query.orderBy('skill.name', 'ASC');

        query.limit(100);

        const result: [Skill[], number] = await query.getManyAndCount();
        // Logger.log(queryParams, 'SkillsService@search', true);

        return {
            result: result[0],
            totalRows: result[1],
        };
    }

    async find(queryParams: SkillQueryDTO): Promise<SkillQueryResult> {
        const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * (queryParams.page - 1)) : 0;
        let query: SelectQueryBuilder<Skill> = this.skillRepository.createQueryBuilder('skill');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('skill.name LIKE :term', { term })
                .orWhere('skill.description LIKE :term', { term });
        }

        if (queryParams.order && queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            // const orderCols: { [key: string]: string } = {
            //     name: 'skill.name',
            //     desc: 'skill.description',
            // };
            query = query.orderBy('skill.name', sort);
        } else
            query = query.orderBy('skill.name', 'ASC');

        query.offset(offset);
        query.limit(queryParams.rowsPerPage);

        const result: [Skill[], number] = await query.getManyAndCount();
        // Logger.log(queryParams, 'SkillService@find', true);

        return {
            result: result[0],
            totalRows: result[1],
        };
    }
}
