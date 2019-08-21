import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Major from '../models/major.entity';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { MajorDTO, MajorsQueryDTO, MajorsQueryResult } from '../models/major.dto';

@Injectable()
export default class MajorService {
    constructor(
        @InjectRepository(Major)
        private readonly majorRepository: Repository<Major>,
    ) { }

    async all(queryParams: MajorsQueryDTO): Promise<MajorsQueryResult> {
        const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * (queryParams.page - 1)) : 0;
        let query: SelectQueryBuilder<Major> = this.majorRepository.createQueryBuilder('m').select('m');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('m.name LIKE :term', { term });
        }

        if (queryParams.order && queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            const orderCols: { [key: string]: string } = {
                name: 'm.name',
            };

            query = query.orderBy(orderCols[queryParams.order], sort);
        } else
            query = query.orderBy('m.name', 'ASC');

        query.offset(offset);
        query.limit(queryParams.rowsPerPage);

        const result: [Major[], number] = await query.getManyAndCount();

        return {
            result: result[0],
            totalRows: result[1],
        };
    }

    async insertMajor(majorDTO: MajorDTO): Promise<Major> {
        try {
            const major: Major = await this.majorRepository.save(majorDTO);
            return major;
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async getDetailMajor(id: number): Promise<Major> {
        const major: Major = await this.majorRepository.findOne(id);
        if (!major) throw new NotFoundException(`Major with id: ${id} Not Found`);
        try {
            return major;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async update(id: number, majorDTO: MajorDTO): Promise<Major> {
        let major: Major = await this.majorRepository.findOne({ where: { id } });
        if (!major) throw new NotFoundException(`Major with id: ${id} Not Found`);
        try {
            major = this.majorRepository.merge(major, majorDTO);
            const updateMajor: Major = await this.majorRepository.save(major);
            return updateMajor;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        const major: boolean = await this.majorRepository.count({ id }) > 0;
        if (!major) throw new NotFoundException(`Major with id: ${id} Not Found`);
        try {
            const removeMajor: DeleteResult = await this.majorRepository.delete(id);
            return removeMajor;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
