import { Controller, Get, Post, Delete, Body, Param, Put, HttpCode, InternalServerErrorException, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import JobService from '../services/job.service';
import {
    ApiUseTags,
    ApiOperation,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiUnauthorizedResponse,
    ApiImplicitQuery,
    ApiNoContentResponse,
} from '@nestjs/swagger';
import { JobDTO, JobResponse, JobPageResponse, JobResponses, JobSearchResponse } from '../models/job.dto';
import Job from '../models/job.entity';
import { ApiExceptionResponse } from '../../../../libraries/responses/response.type';
import { DeleteResult } from 'typeorm';
import CookieAuthGuard from '../../../../api/auth/guards/cookie.guard';
import { ResponseRebuildInterceptor } from '../../../../libraries/responses/response.interceptor';
import { PagingData } from '../../../../libraries/responses/response.class';
import AppConfig from '../../../../config/app.config';

@Controller('jobs')
@ApiUseTags('Jobs')
@UseGuards(CookieAuthGuard)
export default class JobController {

    constructor(
        private readonly jobService: JobService,
        private readonly config: AppConfig,
    ) { }

    @Get()
    @ApiOperation({ title: 'List of Jobs', description: 'API search Jobs' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiImplicitQuery({ name: 'page', description: 'Current page number', type: 'number', required: false })
    @ApiOkResponse({ description: 'If success get list of Jobs', type: JobPageResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async find(
        @Query('term') term?: string,
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
        @Query('page') page: number = 1,
    ): Promise<JobResponses> {
        const rowsPerPage: number = Number(this.config.get('ROWS_PER_PAGE'));
        const { result: data = [], totalRows } = await this.jobService.find({ term, sort, page, rowsPerPage });
        const paging: PagingData = {
            page: Number(page),
            rowsPerPage,
            totalPages: Math.ceil(totalRows / rowsPerPage),
            totalRows,
        };

        return { data, paging };
    }

    @Get('search')
    @ApiOperation({ title: 'Search Job', description: 'API search job by keywords' })
    @ApiImplicitQuery({ name: 'term', description: 'Search keyword', type: 'string', required: false })
    @ApiImplicitQuery({ name: 'sort', description: 'Sorting order (asc or desc)', type: ['asc', 'desc'], required: false })
    @ApiOkResponse({ description: 'If success serach Job', type: JobSearchResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async search(
        @Query('term') term?: string,
        @Query('sort') sort: 'asc' | 'desc' = 'asc',
    ): Promise<JobResponses> {
        const { result: data = [] } = await this.jobService.find({ term, sort, page: 1, rowsPerPage: 1000 });

        return { data };
    }

    @Get(':id')
    @ApiOperation({ title: 'Get a Job', description: 'API get job by id' })
    @ApiOkResponse({ description: 'Success to get job by id', type: JobResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async getById(@Param('id') id: number): Promise<Job> {
        const job: Job = await this.jobService.findById(id);
        return job;
    }

    @Post()
    @ApiOperation({ title: 'Create Job', description: 'API insert into Jobs' })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiCreatedResponse({ description: 'Success to create jobs.', type: JobResponse })
    @ApiUnauthorizedResponse({ description: 'Unauthorized API Call.', type: ApiExceptionResponse })
    @UseInterceptors(ResponseRebuildInterceptor)
    async insert(@Body() jobDto: JobDTO): Promise<Job> {
        const job: Job = await this.jobService.create(jobDto);
        return job;
    }

    @Put(':id')
    @ApiOperation({ title: 'Update Job', description: 'API update Job' })
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
    @ApiOperation({ title: 'Delete Job', description: 'API delete Job by ID' })
    @ApiNotFoundResponse({ description: 'Not found.', type: ApiExceptionResponse })
    @ApiNoContentResponse({ description: 'Successfully delete job.' })
    async delete(@Param('id') id: number): Promise<any> {
        const { affected }: DeleteResult = await this.jobService.remove(id);
        return (affected !== 1) ? new InternalServerErrorException() : null;
    }
}
