import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Role from './models/role.entity';
import RoleService from './services/role.service';
import RoleController from './controllers/role.controller';
import ServicesModule from '../services/services.module';
import MenuModule from '../menus/menu.module';

@Module({
    imports: [TypeOrmModule.forFeature([Role]),
        ServicesModule,
        MenuModule],
    providers: [RoleService],
    exports: [RoleService],
    controllers: [RoleController],
})
export default class RoleModule { }
