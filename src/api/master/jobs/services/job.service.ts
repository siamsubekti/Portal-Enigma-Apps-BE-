import { Injectable, Logger, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import Job from '../models/job.entity';
import { JobDTO } from '../models/job.dto';
let logger = new Logger;

@Injectable()
export class JobService {

    constructor(@InjectRepository(Job) private jobRepository: Repository<Job>) { }

    async findAll(): Promise<Job[]> {
        const jobs = await this.jobRepository.find();
        logger.log('Find all jobs');
        return jobs;
    }

    async create(jobDto: JobDTO): Promise<Job> {
        const job = await this.jobRepository.save(jobDto);
        logger.log(`Insert into jobs with id ${job.id}`);
        return job;
    }

    async remove(param): Promise<Job[]> {
        console.log(JSON.stringify(param))
        const isExist = await this.jobRepository.findByIds(param.id);
        if (isExist.length < 1) {
            throw new NotFoundException('Job not found');
        } else {
            logger.log(`Remove job with id: ${param.id}`);
            const job = await this.jobRepository.remove(param);
            
            return job;
        }

    }

    async update(id, jobDto: JobDTO): Promise<Job> {
        const data = await this.jobRepository.findOne({
            where: {
                id
            }
        })

        if (!data) {
            throw new NotFoundException('Job not found');
        } else {
            data.name = jobDto.name;
            data.description = jobDto.description;
        }
        const updatedJob = await this.jobRepository.save(data);
        return updatedJob;
    }
}
