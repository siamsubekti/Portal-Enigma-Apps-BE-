import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { DatabaseConnectionConfig } from '../config/database.config';
import { ApiController } from './main/api.controller';
import { ApiService } from './main/api.service';
import { LibraryModule } from '../libraries/library.module';
import { JobModule } from './master/jobs/job.module';

@Module({
  imports: [
    ConfigModule,
    LibraryModule,
    JobModule,
    TypeOrmModule.forRootAsync({
      imports: [ ConfigModule ],
      useClass: DatabaseConnectionConfig,
    }),
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
