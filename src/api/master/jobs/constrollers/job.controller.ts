import { Controller, Get, Post, Body } from '@nestjs/common';
import { JobServices } from '../services/job.service';
import { ApiUseTags, ApiOperation, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import ResponseUtil from 'src/libraries/response/response.util';
import { async } from 'rxjs/internal/scheduler/async';
import { JobDTO } from '../models/job.dto';
import Job from '../models/job.entity';

@Controller('jobs')
export class JobsController {

    constructor(
        private readonly jobService: JobServices, 
        private readonly responseUtil: ResponseUtil 
        ) { }

    @Get()
    @ApiUseTags('Jobs')
    @ApiOperation({ title: 'Jobs', description: 'API get list Jobs' })
    @ApiOkResponse({description: 'Success'})
    async get() {
        const jobs = await this.jobService.findAll();

        return this.responseUtil.rebuildPagedResponse(jobs);
    }

    @Post()
    @ApiUseTags('Jobs')
    @ApiOperation({ title: 'Jobs', description: 'API insert into Jobs' })
    async insert(@Body() jobDto: JobDTO){
        const job = await this.jobService.create(jobDto);

        return this.responseUtil.rebuildResponse(job);
    }
}