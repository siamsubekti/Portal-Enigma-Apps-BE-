import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Menu from './models/menu.entity';
import MenuService from './services/menu.service';
import MenuController from './controllers/menu.controller';
import Role from '../roles/models/role.entity';
import RoleService from '../roles/services/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Role])],
  providers: [MenuService, RoleService],
  controllers: [MenuController],
})
export class MenuModule {}
