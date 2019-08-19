import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import Job from '../models/job.entity';
import { JobDTO, JobQueryDTO, JobQueryResult } from '../models/job.dto';

@Injectable()
export default class JobService {

    constructor(@InjectRepository(Job) private jobRepository: Repository<Job>) { }

    async findAll(): Promise<Job[]> {
        return await this.jobRepository.find();
    }

    async findById(id: number): Promise<Job> {
        return await this.jobRepository.findOne(id);
    }

    async create(jobDto: JobDTO): Promise<Job> {
        const exist: boolean = await this.jobRepository.count({ where: { name: jobDto.name } }) === 1;
        if (exist) throw new BadRequestException('Data ini telah ada.');
        return await this.jobRepository.save(jobDto);
    }

    async remove(id: number): Promise<DeleteResult> {
        const isExist: boolean = (await this.jobRepository.count({ id })) > 0;
        if (!isExist) throw new NotFoundException(`Job with id: ${id} not found`);
        else return await this.jobRepository.delete(id);

    }

    async update(id: number, jobDto: JobDTO): Promise<Job> {
        let data: Job = await this.jobRepository.findOne({
            where: { id },
        });

        if (!data) throw new NotFoundException(`Job with id: ${id} not found`);
        else {
            const exist: boolean = await this.jobRepository.count({ where: { name: jobDto.name } }) === 1;
            if (exist && jobDto.name !== data.name) throw new BadRequestException('Data ini telah ada.');
            data = this.jobRepository.merge(data, jobDto);
            return await this.jobRepository.save(data);
        }
    }

    async search(queryParams: JobQueryDTO): Promise<JobQueryResult> {
        let query: SelectQueryBuilder<Job> = this.jobRepository.createQueryBuilder('job');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('job.name LIKE :term', { term })
                .orWhere('job.description LIKE :term', { term });
        }

        if (queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            // const orderCols: { [key: string]: string } = {
            //     name: 'job.name',
            // };
            query = query.orderBy('job.name', sort);
        } else
            query = query.orderBy('job.name', 'ASC');

        query.limit(100);

        const result: [Job[], number] = await query.getManyAndCount();
        // Logger.log(queryParams, 'JobService@search', true);

        return {
            result: result[0],
            totalRows: result[1],
        };
    }

    async find(queryParams: JobQueryDTO): Promise<JobQueryResult> {
        let query: SelectQueryBuilder<Job> = this.jobRepository.createQueryBuilder('job');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('job.name LIKE :term', { term })
                .orWhere('job.description LIKE :term', { term });
        }

        if (queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            // const orderCols: { [key: string]: string } = {
            //     name: 'job.name',
            // };
            query = query.orderBy('job.name', sort);
        } else
            query = query.orderBy('job.name', 'ASC');

        query.offset(queryParams.page > 1 ? (queryParams.rowsPerPage * queryParams.page) + 1 : 0);
        query.limit(queryParams.rowsPerPage);

        const result: [Job[], number] = await query.getManyAndCount();
        // Logger.log(queryParams, 'ServiceService@find', true);

        return {
            result: result[0],
            totalRows: result[1],
        };
    }
}
