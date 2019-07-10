import { Controller, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Template from '../models/template.entity';
import { Repository, DeleteResult } from 'typeorm';
import { TemplateDTO } from '../models/template.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TemplateService {

    constructor(@InjectRepository(Template)private templateRepository: Repository<Template>){}

    async findAll(): Promise<Template[]>{
        const templates = await this.templateRepository.find();
        return templates;
    }

    async create(templateDto: TemplateDTO): Promise<Template>{
        const template = await this.templateRepository.save(templateDto);
        return template;
    }

    async remove(id): Promise<DeleteResult>{
        const template = await this.templateRepository.delete(id);
        if(template.affected < 1 ){
            throw new HttpException('Failed to delete template', HttpStatus.NOT_FOUND);
        }
        return template;
    }
}
