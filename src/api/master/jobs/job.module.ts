import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Job from './models/job.entity';
import JobController from './constrollers/job.controller';
import JobService from './services/job.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Job]),
    ],
    controllers: [JobController],
    providers: [JobService],
})
export default class JobModule {

}
