import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionConfig } from '../config/database.config';
import { ApiController } from './main/api.controller';
import { ApiService } from './main/api.service';
import ConfigModule from '../config/config.module';
import LibraryModule from '../libraries/library.module';
import AccountModule from './accounts/account.module';
import AuthModule from './auth/auth.module';
import { AcademyModule } from './academies/academy.module';
import { MajorModule } from './majors/major.module';
import { DegreeModule } from './degrees/degree.module';
import { RoleModule } from './roles/role.module';

@Module({
  imports: [
    ConfigModule,
    LibraryModule,
    AcademyModule,
    MajorModule,
    DegreeModule,
    RoleModule,
    TypeOrmModule.forRootAsync({
      imports: [ ConfigModule ],
      useClass: DatabaseConnectionConfig,
    }),
    AccountModule,
    AuthModule,
  ],
  controllers: [ ApiController ],
  providers: [ ApiService ],
})
export class ApiModule {}
