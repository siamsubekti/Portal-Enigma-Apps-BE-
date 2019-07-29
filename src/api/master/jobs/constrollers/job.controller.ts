import { Controller, Get, Post, Delete, Body, Param, Put, HttpCode, InternalServerErrorException, UseInterceptors, UseGuards } from '@nestjs/common';
import JobService from '../services/job.service';
import { ApiUseTags, ApiOperation, ApiOkResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JobDTO, JobResponse, JobPageResponse } from '../models/job.dto';
import Job from '../models/job.entity';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';

@Controller('jobs')
@ApiUseTags('Jobs')
@UseGuards(CookieAuthGuard)
export default class JobController {

    constructor(
        private readonly jobService: JobService,
    ) { }

    @Get()
    @ApiOperation({ title: 'GET Jobs', description: 'API get list Jobs' })
    @ApiOkResponse({ description: 'Success to get list of jobs.', type: JobPageResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async get(): Promise<Job[]> {
        const jobs: Job[] = await this.jobService.findAll();
        return jobs;
    }

    @Get(':id')
    @ApiOperation({ title: 'GET Job By Id', description: 'API get job by id' })
    @ApiOkResponse({ description: 'Success to get job by id', type: JobResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getById(@Param('id') id: number): Promise<Job> {
        const job: Job = await this.jobService.findById(id);
        return job;
    }

    @Post()
    @ApiOperation({ title: 'CREATE Job', description: 'API insert into Jobs' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiCreatedResponse({ description: 'Success to create jobs.', type: JobResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() jobDto: JobDTO): Promise<Job> {
        const job: Job = await this.jobService.create(jobDto);
        return job;
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Job', description: 'API update Job' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiOkResponse({ description: 'Success to update jobs.', type: JobResponse })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async update(@Param('id') id: number, @Body() jobDto: JobDTO): Promise<Job> {
        const updatedJob: Job = await this.jobService.update(id, jobDto);
        return updatedJob;
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Job', description: 'API delete Job by ID' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    async delete(@Param('id') id: number): Promise<any> {
        const { affected }: DeleteResult = await this.jobService.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }
}
