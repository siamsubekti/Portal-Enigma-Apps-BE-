import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Account from '../accounts/models/account.entity';
import CandidateController from './controllers/candidate.controller';
import CandidateService from './services/candidate.service';
import Profile from '../accounts/models/profile.entity';
import Document from '../resumes/document/models/document.entity';
import DocumentService from '../resumes/document/services/document.service';

@Module({
  controllers: [CandidateController],
  imports: [TypeOrmModule.forFeature([Account, Profile, Document]),
  ],
  exports: [CandidateService],
  providers: [CandidateService, DocumentService],
})
export default class CandidateModule { }
