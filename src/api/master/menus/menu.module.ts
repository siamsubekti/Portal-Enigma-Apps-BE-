import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Menu from './models/menu.entity';
import MenuService from './services/menu.service';
import MenuController from './controllers/menu.controller';
import Role from '../roles/models/role.entity';
import RoleService from '../roles/services/role.service';
import ServicesService from '../services/services/services.service';
import Service from '../services/models/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Role, Service])],
  providers: [MenuService, RoleService, ServicesService],
  exports: [MenuService],
  controllers: [MenuController],
})
export default class MenuModule {}
