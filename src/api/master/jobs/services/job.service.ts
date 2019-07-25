import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import Job from '../models/job.entity';
import { JobDTO } from '../models/job.dto';

@Injectable()
export class JobService {

    constructor(@InjectRepository(Job) private jobRepository: Repository<Job>) { }

    async findAll(): Promise<Job[]> {
        return await this.jobRepository.find();
    }

    async findById(id: number): Promise<Job> {
        return await this.jobRepository.findOne(id);
    }

    // async search(keyword: string): Promise<Job[]> {
    //     return await this.jobRepository.find({
    //         where: [
    //             {
    //                 name: Like(`%${keyword}%`)
    //             },
    //             {
    //                 description: Like(`%${keyword}%`)
    //             }
    //         ]
    //     });
    // }

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
}
