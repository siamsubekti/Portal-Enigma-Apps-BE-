import { Injectable, Logger, HttpException, HttpStatus, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import Job from '../models/job.entity';
import { JobDTO } from '../models/job.dto';
let logger = new Logger;

@Injectable()
export class JobService {

    constructor(@InjectRepository(Job) private jobRepository: Repository<Job>) { }

    async findAll(): Promise<Job[]> {
        try {
            const jobs: Job[] = await this.jobRepository.find();
            logger.log('Find all jobs');
            return jobs;
        } catch (error) {
            logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    async create(jobDto: JobDTO): Promise<Job> {
        const job: Job = await this.jobRepository.findOne({
            where: {
                name: jobDto.name
            }
        });
        if (job) {
            throw new HttpException('Data ini telah ada', HttpStatus.BAD_REQUEST);
        } else {
            try {
                const job: Job = await this.jobRepository.save(jobDto);
                logger.log(`Insert into jobs with id ${job.id}`);
                return job;
            } catch (error) {
                logger.error(error);
                throw new InternalServerErrorException();
            }

        }

    }

    async remove(id: number): Promise<DeleteResult> {
        const isExist: boolean = (await this.jobRepository.count({ id })) > 0;
        if (!isExist) {
            throw new NotFoundException(`Job with id: ${id} not found`);
        } else {
            try {
                const job: DeleteResult = await this.jobRepository.delete(id);
                return job;
            } catch (error) {
                logger.error(error);
                throw new InternalServerErrorException();
            }
        }

    }

    async update(id: number, jobDto: JobDTO): Promise<Job> {
        let data: Job = await this.jobRepository.findOne({
            where: {
                id
            }
        });

        if (!data) {
            throw new NotFoundException(`Job with id: ${id} not found`);
        } else {
            try {
                data = this.jobRepository.merge(data, jobDto);
                const updatedJob: Job = await this.jobRepository.save(data);
                return updatedJob;
            } catch (error) {
                logger.error(error);
                throw new InternalServerErrorException();
            }
        }

    }
}
