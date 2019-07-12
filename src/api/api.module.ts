import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionConfig } from '../config/database.config';
import { ApiController } from './main/api.controller';
import { ApiService } from './main/api.service';
import { JobModule } from './master/jobs/job.module';
import { RegionsModule } from './master/regions/regions.module';
import { SkillsModule } from './master/skills/skills.module';
import { TemplateModule } from './master/templates/template.module';
import ConfigModule from '../config/config.module';
import LibraryModule from '../libraries/library.module';
import AccountModule from './accounts/account.module';
import AuthModule from './auth/auth.module';
import { ParameterModule } from './master/parameters/parameter.module';

@Module({
  imports: [
    ConfigModule,
    LibraryModule,
    JobModule,
    RegionsModule,
    SkillsModule,
    TemplateModule,
    TypeOrmModule.forRootAsync({
      imports: [ ConfigModule ],
      useClass: DatabaseConnectionConfig,
    }),
    AccountModule,
    AuthModule,
    ParameterModule,
  ],
  controllers: [ ApiController ],
  providers: [ ApiService ],
})
export class ApiModule {}
