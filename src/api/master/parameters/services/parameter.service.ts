import { Injectable, NotFoundException, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import Parameter from '../models/parameter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import ParameterDTO, { ParameterQueryDTO, ParameterQueryResult } from '../models/parameter.dto';

@Injectable()
export default class ParameterService {

    constructor(@InjectRepository(Parameter) private parameterRepository: Repository<Parameter>) { }

    async findById(id: number): Promise<Parameter> {
        return await this.parameterRepository.findOne({ where: { id } });
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

    async find(queryParams: ParameterQueryDTO): Promise<ParameterQueryResult> {
        let query: SelectQueryBuilder<Parameter> = this.parameterRepository.createQueryBuilder('p');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('p.key LIKE :term', { term })
                .orWhere('p.value LIKE :term', { term });
        }

        if (queryParams.order && queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            const orderCols: { [key: string]: string } = {
                key: 'p.key',
                value: 'p.value',
            };
            query = query.orderBy(orderCols[queryParams.order], sort);
        } else
            query = query.orderBy('p.key', 'ASC');

        query.offset(queryParams.page > 1 ? (queryParams.rowsPerPage * queryParams.page) + 1 : 0);
        query.limit(queryParams.rowsPerPage);

        const result: [Parameter[], number] = await query.getManyAndCount();
        Logger.log(queryParams, 'ParameterService@find', true);

        return {
            result: result[0],
            totalRows: result[1],
        };
    }

    async search(queryParams: ParameterQueryDTO): Promise<ParameterQueryResult> {
        let query: SelectQueryBuilder<Parameter> = this.parameterRepository.createQueryBuilder('p');

        try {
            if (queryParams.term) {
                let { term } = queryParams;
                term = `%${term}%`;
                query = query
                    .orWhere('p.key LIKE :term', { term })
                    .orWhere('p.value LIKE :term', { term });
            }

            if (queryParams.order && queryParams.sort) {
                const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
                const orderCols: { [key: string]: string } = {
                    key: 'p.key',
                    value: 'p.value',
                };
                query = query.orderBy(orderCols[queryParams.order], sort);
            } else
                query = query.orderBy('p.key', 'ASC');

            query.limit(1000);

            const result: [Parameter[], number] = await query.getManyAndCount();
            Logger.log(queryParams, 'ParameterService@search', true);
            return {
                result: result[0],
                totalRows: result[1],
            };
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException();
        }
    }
}
