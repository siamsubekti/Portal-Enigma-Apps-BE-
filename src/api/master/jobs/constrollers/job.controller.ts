import { Controller, Get, Post, Delete, Body, Logger, Param, Put, HttpCode } from '@nestjs/common';
import { JobService } from '../services/job.service';
import ResponseUtil from 'src/libraries/response/response.util';
import { ApiUseTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { JobDTO, JobResponse, JobPageResponse } from '../models/job.dto';
import Job from '../models/job.entity';
let logger = new Logger;

@Controller('jobs')
@ApiUseTags('Jobs')
export class JobController {

    constructor(
        private readonly jobService: JobService,
        private readonly responseUtil: ResponseUtil
    ) { }

    @Get()
    @ApiOperation({ title: 'GET Jobs', description: 'API get list Jobs' })
    @ApiOkResponse({ description: 'Success' })
    async get(): Promise<JobPageResponse> {
        const jobs: Job[] = await this.jobService.findAll();
        return this.responseUtil.rebuildPagedResponse(jobs);
    }

    @Post()
    @ApiOperation({ title: 'CREATE Jobs', description: 'API insert into Jobs' })
    async insert(@Body() jobDto: JobDTO): Promise<JobResponse> {
        const job: Job = await this.jobService.create(jobDto);
        return this.responseUtil.rebuildResponse(job);
    }

    @Put(':id')
    @ApiOperation({ title: 'UPDATE Job', description: 'API update Job' })
    async update(@Param('id') id, @Body() jobDto: JobDTO): Promise<JobResponse> {
        const updatedJob: Job = await this.jobService.update(id, jobDto);
        return this.responseUtil.rebuildResponse(updatedJob);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ title: 'DELETE Job', description: 'API delete Job by ID' })
    async delete(@Param('id') id: number) {
        const job = await this.jobService.remove(id);
        return this.responseUtil.rebuildResponse(job);
    }
}
