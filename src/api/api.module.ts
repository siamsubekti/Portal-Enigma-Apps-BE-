import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiController } from './main/api.controller';
import JobModule from './master/jobs/job.module';
import RegionsModule from './master/regions/regions.module';
import SkillsModule from './master/skills/skills.module';
import TemplateModule from './master/templates/template.module';
import ParameterModule from './master/parameters/parameter.module';
import AcademyModule from './master/academies/academy.module';
import MajorModule from './master/majors/major.module';
import DegreeModule from './master/degrees/degree.module';
import RoleModule from './master/roles/role.module';
import ServicesModule from './master/services/services.module';
import MenuModule from './master/menus/menu.module';
import DatabaseConnectionConfig from '../config/database.config';
import ConfigModule from '../config/config.module';
import LibraryModule from '../libraries/library.module';
import AccountModule from './accounts/account.module';
import AuthModule from './auth/auth.module';
import MigrationModule from './migrations/migration.module';
import CandidateModule from './candidates/candidate.module';

@Module({
  imports: [
    ConfigModule,
    LibraryModule,
    JobModule,
    RegionsModule,
    SkillsModule,
    TemplateModule,
    AcademyModule,
    MajorModule,
    DegreeModule,
    RoleModule,
    MenuModule,
    TypeOrmModule.forRootAsync({
      imports: [ ConfigModule ],
      useClass: DatabaseConnectionConfig,
    }),
    AccountModule,
    AuthModule,
    ParameterModule,
    ServicesModule,
    MigrationModule,
    CandidateModule,
  ],
  controllers: [ ApiController],
})
export default class ApiModule {}
