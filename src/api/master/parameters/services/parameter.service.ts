import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import Parameter from '../models/parameter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import ParameterDTO from '../models/parameter.dto';

@Injectable()
export class ParameterService {

    constructor(@InjectRepository(Parameter)
    private parameterRepository: Repository<Parameter>
    ) { }

    async findAll(): Promise<Parameter[]> {
        return await this.parameterRepository.find();
    }

    async get(key: string):Promise<string>{
        const parameter: Parameter = await this.parameterRepository.findOne({
            select: ["value"],
            where: {
                key
            }
        });

        return parameter ? parameter.value : null;
    }

    async create(parameterDto: ParameterDTO): Promise<Parameter> {
        return await this.parameterRepository.save(parameterDto);
    }

    async update(id: number, parameterDto: ParameterDTO): Promise<Parameter> {
        let parameter = await this.parameterRepository.findOne({
            where: {
                id
            }
        });

        if (!parameter) {
            throw new NotFoundException(`Parameter with id: ${id} not found`);
        } else {
            try {
                parameter = this.parameterRepository.merge(parameter, parameterDto);
                const updatedParameter = await this.parameterRepository.save(parameter);
                return updatedParameter;
            } catch (error) {
                throw new InternalServerErrorException();
            }
        }
    }

    async remove(id: number): Promise<DeleteResult> {
        const isExist = await this.parameterRepository.count({ id }) > 0;
        if (!isExist) {
            throw new NotFoundException(`Parameter with id: ${id} not found`);
        } else {
            try {
                const deletedParameter = await this.parameterRepository.delete(id);
                return deletedParameter;
            } catch (error) {
                throw new InternalServerErrorException();
            }
        }
    }
}
