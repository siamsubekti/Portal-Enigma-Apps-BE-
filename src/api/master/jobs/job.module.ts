import { Module } from '@nestjs/common';
import Job from './models/job.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './constrollers/job.controller';
import { JobServices } from './services/job.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Job])
    ],
    controllers: [JobsController],
    providers: [JobServices],
})
export class JobModule { }