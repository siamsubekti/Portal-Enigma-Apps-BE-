import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from '../accounts/models/account.entity';
import CandidateController from './controllers/candidate.controller';
import CandidateService from './services/candidate.service';
import Profile from '../accounts/models/profile.entity';

@Module({
  controllers: [CandidateController],
  imports: [TypeOrmModule.forFeature([Account, Profile]),
  ],
  exports: [CandidateService],
  providers: [CandidateService],
})
export default class CandidateModule { }
