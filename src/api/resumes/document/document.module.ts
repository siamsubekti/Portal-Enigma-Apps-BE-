import { Module } from '@nestjs/common';
import DocumentController from './controllers/document.controller';
import DocumentService from './services/document.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Document from './models/document.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([ Document ])],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule {}
