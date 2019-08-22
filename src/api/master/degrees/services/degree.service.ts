import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Degree from '../models/degree.entity';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { DegreesQueryDTO, DegreesQueryResult, DegreeDTO } from '../models/degree.dto';

@Injectable()
export default class DegreeService {
    constructor(
        @InjectRepository(Degree)
        private readonly degreeRepository: Repository<Degree>,
    ) { }

    async all(queryParams: DegreesQueryDTO): Promise<DegreesQueryResult> {
        const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * (queryParams.page - 1)) : 0;
        let query: SelectQueryBuilder<Degree> = this.degreeRepository.createQueryBuilder('d').select('d');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('d.name LIKE :term', { term });
        }

        if (queryParams.order && queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            const orderCols: { [key: string]: string } = {
                name: 'd.name',
            };

            query = query.orderBy(orderCols[queryParams.order], sort);
        } else
            query = query.orderBy('d.name', 'ASC');

        query.offset(offset);
        query.limit(queryParams.rowsPerPage);

        const result: [Degree[], number] = await query.getManyAndCount();

        return {
            result: result[0],
            totalRows: result[1],
        };
    }

    async get(id: number): Promise<Degree> {
        const degree: Degree = await this.degreeRepository.findOne(id);
        // Logger.log(degree);
        if (!degree) throw new NotFoundException(`Degree with id: ${id} Not Found`);
        try {
            return degree;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async insert(degreeDTO: DegreeDTO): Promise<Degree> {
        try {
            const degree: Degree = await this.degreeRepository.save(degreeDTO);
            return degree;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async update(id: number, degreeDTO: DegreeDTO): Promise<Degree> {
        let degree: Degree = await this.degreeRepository.findOne({ where: { id } });
        if (!degree) throw new NotFoundException(`Degree with id: ${id} Not Found`);
        try {
            degree = this.degreeRepository.merge(degree, degreeDTO);
            const updateDegree: Degree = await this.degreeRepository.save(degree);
            return updateDegree;
        } catch (error) {
            throw new InternalServerErrorException('Internal server error');
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        const countId: boolean = await this.degreeRepository.count({ id }) > 0;
        if (!countId) throw new NotFoundException(`Degree with id: ${id} Not Found`);
        const result: DeleteResult = await this.degreeRepository.delete(id);
        try {
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
