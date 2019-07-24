import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import Template from '../models/template.entity';
import { Repository, DeleteResult } from 'typeorm';
import { TemplateDTO } from '../models/template.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TemplateService {

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

        if (template) throw new BadRequestException('Data ini telah ada');
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
            if (exist && templateDto.name !== data.name) throw new BadRequestException('Data ini telah ada.');
            data = this.templateRepository.merge(data, templateDto);
            return await this.templateRepository.save(data);
        }
    }
}
