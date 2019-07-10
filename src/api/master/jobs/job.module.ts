import { Module } from '@nestjs/common';
import Job from './models/job.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobController } from './constrollers/job.controller';
import { JobService } from './services/job.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Job])
    ],
    controllers: [JobController],
    providers: [JobService],
})
export class JobModule { }