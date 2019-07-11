import { Controller, HttpException, HttpStatus, Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import Template from '../models/template.entity';
import { Repository, DeleteResult, Not } from 'typeorm';
import { TemplateDTO } from '../models/template.dto';
import { InjectRepository } from '@nestjs/typeorm';
let logger = new Logger;

@Injectable()
export class TemplateService {

    constructor(@InjectRepository(Template) private templateRepository: Repository<Template>) { }

    async findAll(): Promise<Template[]> {
        try {
            const templates: Template[] = await this.templateRepository.find();
            return templates;
        } catch (error) {
            logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    async create(templateDto: TemplateDTO): Promise<Template> {
        const template = await this.templateRepository.findOne({
            where: {
                name: templateDto.name
            }
        });

        if (template) {
            throw new NotFoundException('Data ini telah ada')
        } else {
            try {
                const template: Template = await this.templateRepository.save(templateDto);
                return template;
            } catch (error) {
                logger.error(error);
                throw new InternalServerErrorException();
            }
        }
    }

    async remove(id): Promise<DeleteResult> {
        const isExist = await this.templateRepository.count(id) > 0;
        if (!isExist) {
            throw new NotFoundException('Template not found');
        } else {
            try {
                const template: DeleteResult = await this.templateRepository.delete(id);
                return template;
            } catch (error) {
                logger.error(error);
                throw new InternalServerErrorException();
            }
        }
    }

    async update(id, templateDto: TemplateDTO): Promise<Template> {
        let data: Template = await this.templateRepository.findOne({
            where: {
                id
            }
        });

        if (!data) {
            throw new NotFoundException('Template Not Found');
        } else {
            try {
                data = this.templateRepository.merge(data, templateDto);
                const template: Template = await this.templateRepository.save(data);
                return template;
            } catch (error) {
                throw new InternalServerErrorException();
            }
        }
    }
}
