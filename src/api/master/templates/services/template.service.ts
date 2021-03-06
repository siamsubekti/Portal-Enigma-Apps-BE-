import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import Template from '../models/template.entity';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { TemplateDTO, TemplateQueryDTO, TemplateQueryResult } from '../models/template.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class TemplateService {

    constructor(@InjectRepository(Template) private templateRepository: Repository<Template>) { }

    async findAll(): Promise<Template[]> {
        return await this.templateRepository.find();
    }

    async findById(id: number): Promise<Template> {
        return await this.templateRepository.findOne(id);
    }

    async create(templateDto: TemplateDTO): Promise<Template> {
        const template: Template = await this.templateRepository.findOne({
            where: { name: templateDto.name },
        });

        if (template) throw new BadRequestException('Data already exists.');
        else return await this.templateRepository.save(templateDto);
    }

    async remove(id: number): Promise<DeleteResult> {
        const isExist: boolean = await this.templateRepository.count({ id }) > 0;
        if (!isExist) throw new NotFoundException(`Template with id: ${id} not found`);
        else return await this.templateRepository.delete(id);
    }

    async update(id: number, templateDto: TemplateDTO): Promise<Template> {
        let data: Template = await this.templateRepository.findOne({
            where: { id },
        });

        if (!data) throw new NotFoundException(`Template with id: ${id} not found`);
        else {
            const exist: boolean = await this.templateRepository.count({ where: { name: templateDto.name } }) === 1;
            if (exist && templateDto.name !== data.name) throw new BadRequestException('Name already exists.');
            data = this.templateRepository.merge(data, templateDto);
            return await this.templateRepository.save(data);
        }
    }

    async find(queryParams: TemplateQueryDTO): Promise<TemplateQueryResult> {
        const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * (queryParams.page - 1)) : 0;
        let query: SelectQueryBuilder<Template> = this.templateRepository.createQueryBuilder('t');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('t.name LIKE :term', { term })
                .orWhere('t.type LIKE :term', { term });
        }

        if (queryParams.order && queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            const orderCols: { [key: string]: string } = {
                name: 't.name',
                type: 't.type',
            };
            query = query.orderBy(orderCols[queryParams.order], sort);
        } else
            query = query.orderBy('t.name', 'ASC');

        query.offset(offset);
        query.limit(queryParams.rowsPerPage);

        const result: [Template[], number] = await query.getManyAndCount();
        // Logger.log(queryParams, 'TemplateService@find', true);

        return {
            result: result[0],
            totalRows: result[1],
        };
    }
}
