import { Injectable } from '@nestjs/common';
import Job from '../models/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobDTO } from '../models/job.dto';

@Injectable()
export class JobServices {

    constructor(@InjectRepository(Job) private jobRepository: Repository<Job>) { }

    async findAll(): Promise<Job[]>{
        const jobs = await this.jobRepository.find();
        return jobs;
    }

    async create(jobDto: JobDTO): Promise<Job>{
        const job = await this.jobRepository.save(jobDto);
        return job;
    }


}