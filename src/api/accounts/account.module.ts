import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from './models/account.entity';
import Profile from './models/profile.entity';
import AccountService from './services/account.service';
import ProfileService from './services/profile.service';
import AccountController from './controllers/account.controller';
import RoleModule from '../master/roles/role.module';
import MenuModule from '../master/menus/menu.module';
import ServicesModule from '../master/services/services.module';

@Module({
  controllers: [ AccountController ],
  imports: [ TypeOrmModule.forFeature([ Account, Profile ]), RoleModule, MenuModule, ServicesModule ],
  exports: [ AccountService, ProfileService ],
  providers: [ AccountService, ProfileService ],
})
export default class AccountModule {}
