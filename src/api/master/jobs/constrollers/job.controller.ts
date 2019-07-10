import { Controller, Get, Post, Delete, Body, Logger, HttpException, HttpStatus, Param, Put } from '@nestjs/common';
import { JobService } from '../services/job.service';
import ResponseUtil from 'src/libraries/response/response.util';
import { ApiUseTags, ApiOperation, ApiOkResponse, ApiImplicitParam } from '@nestjs/swagger';
import { JobDTO } from '../models/job.dto';
let logger = new Logger;

@Controller('jobs')
export class JobController {

    constructor(
        private readonly jobService: JobService,
        private readonly responseUtil: ResponseUtil
    ) { }

    @Get()
    @ApiUseTags('Jobs')
    @ApiOperation({ title: 'Jobs', description: 'API get list Jobs' })
    @ApiOkResponse({ description: 'Success' })
    async get() {
        const jobs = await this.jobService.findAll();

        return this.responseUtil.rebuildPagedResponse(jobs);
    }

    @Post()
    @ApiUseTags('Jobs')
    @ApiOperation({ title: 'Jobs', description: 'API insert into Jobs' })
    async insert(@Body() jobDto: JobDTO) {
        try {
            const job = await this.jobService.create(jobDto);

            return this.responseUtil.rebuildResponse(job);
        } catch (error) {
            logger.error(error);
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Put(':id')
    @ApiUseTags('Jobs')
    async update(@Param('id') id, @Body() jobDto: JobDTO): Promise<any> {
        // updateJobDto.id = Number(id);
        // console.log('Update #' + updateJobDto.id)
        const updatedJob = await this.jobService.update(id, jobDto);
        return this.responseUtil.rebuildResponse(updatedJob);
    }

    @Delete(':id')
    @ApiUseTags('Jobs')
    async delete(@Param() id) {
        // try {
            const job = await this.jobService.remove(id);
            return this.responseUtil.rebuildResponse(job);
        // } catch (error) {
        //     throw new HttpException('Failed to delete job', HttpStatus.NOT_FOUND);
        // }
    }
}
