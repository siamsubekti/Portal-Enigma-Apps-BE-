import { Module } from '@nestjs/common';
import { ServicesController } from './controllers/services.controller';
import { ServicesService } from './services/services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Service from './models/service.entity';
import { RoleService } from '../roles/services/role.service';
import { RoleModule } from '../roles/role.module';
import Role from '../roles/models/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    RoleModule
  ],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule { }
