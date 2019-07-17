import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import Parameter from '../models/parameter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import ParameterDTO from '../models/parameter.dto';

@Injectable()
export class ParameterService {

    constructor(@InjectRepository(Parameter) private parameterRepository: Repository<Parameter>) { }

    async findAll(): Promise<Parameter[]> {
        return await this.parameterRepository.find();
    }

    async get(key: string): Promise<string> {
        const parameter: Parameter = await this.parameterRepository.findOne({
            select: ['value'],
            where: { key },
        });

        return parameter ? parameter.value : null;
    }

    async create(parameterDto: ParameterDTO): Promise<Parameter> {
        const parameter: Parameter = await this.parameterRepository.findOne({ where: { key: parameterDto.key } });
        if (parameter) throw new BadRequestException('Data ini telah ada');
        else return await this.parameterRepository.save(parameterDto);
    }

    async update(id: number, parameterDto: ParameterDTO): Promise<Parameter> {
        let parameter: Parameter = await this.parameterRepository.findOne({
            where: { id },
        });

        if (!parameter) throw new NotFoundException(`Parameter with id: ${id} not found`);
        else {
            const exist: boolean = await this.parameterRepository.count({ where: { key: parameterDto.key } }) === 1;
            if (exist && parameterDto.key !== parameter.key) throw new BadRequestException('Data ini telah ada');
            parameter = this.parameterRepository.merge(parameter, parameterDto);
            return await this.parameterRepository.save(parameter);
        }
    }

    async remove(id: number): Promise<DeleteResult> {
        const isExist: boolean = await this.parameterRepository.count({ id }) > 0;
        if (!isExist) throw new NotFoundException(`Parameter with id: ${id} not found`);
        else return await this.parameterRepository.delete(id);

    }
}
