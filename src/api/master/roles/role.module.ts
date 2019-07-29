import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Role from './models/role.entity';
import RoleService from './services/role.service';
import RoleController from './controllers/role.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    providers: [RoleService],
    controllers: [RoleController],
})
export class RoleModule {}
