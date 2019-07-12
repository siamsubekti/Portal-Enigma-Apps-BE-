import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from './models/account.entity';
import Profile from './models/profile.entity';
import AccountService from './services/account.service';
import ProfileService from './services/profile.service';

@Module({
  imports: [ TypeOrmModule.forFeature([ Account, Profile ]) ],
  exports: [ AccountService, ProfileService ],
  providers: [ AccountService, ProfileService ],
})
export default class AccountModule {}
