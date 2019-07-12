import { Controller, Get, Post, Delete, Body, Param, Put, HttpCode, InternalServerErrorException } from '@nestjs/common';
import { JobService } from '../services/job.service';
import ResponseUtil from 'src/libraries/responses/response.util';
import { ApiUseTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { JobDTO, JobResponse, JobPageResponse } from '../models/job.dto';
import Job from '../models/job.entity';
import { ApiExceptionResponse } from 'src/libraries/responses/response.type';
import { DeleteResult } from 'typeorm';

@Controller('jobs')
@ApiUseTags('Jobs')
export class JobController {

    constructor(
        private readonly jobService: JobService,
        private readonly responseUtil: ResponseUtil
    ) { }

    @Get()
    @ApiOperation({ title: 'GET Jobs', description: 'API get list Jobs' })
    @ApiOkResponse({ description: 'Success to get list of jobs.', type: JobPageResponse })
    async get(): Promise<JobPageResponse> {
        const jobs: Job[] = await this.jobService.findAll();
        return this.responseUtil.rebuildPagedResponse(jobs);
    }

    @Post()
    @ApiOperation({ title: 'CREATE Job', description: 'API insert into Jobs' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to create jobs.', type: JobResponse })
    async insert(@Body() jobDto: JobDTO): Promise<JobResponse> {
        const job: Job = await this.jobService.create(jobDto);
        return this.responseUtil.rebuildResponse(job);
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Job', description: 'API update Job' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to update jobs.', type: JobResponse })
    async update(@Param('id') id: number, @Body() jobDto: JobDTO): Promise<JobResponse> {
        const updatedJob: Job = await this.jobService.update(id, jobDto);
        return this.responseUtil.rebuildResponse(updatedJob);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Job', description: 'API delete Job by ID' })
    // @ApiGoneResponse({ description: 'Success to delete job'})
    async delete(@Param('id') id: number) {
        const { affected }: DeleteResult = await this.jobService.remove(id);
        // return this.responseUtil.rebuildResponse(job);
        if (affected === 1) {
            return null;
        } else {
            throw new InternalServerErrorException();
        }
    }
}
