import { Module } from '@nestjs/common';
import MigrationController from './controllers/migration.controller';
import MigrationService from './services/migration.service';
import { RoleModule } from '../master/roles/role.module';
import { MenuModule } from '../master/menus/menu.module';
import ServicesModule from '../master/services/services.module';

@Module({
  controllers: [MigrationController],
  imports: [RoleModule, MenuModule, ServicesModule],
  exports: [MigrationService],
  providers: [MigrationService],
})
export default class MigrationModule {}
