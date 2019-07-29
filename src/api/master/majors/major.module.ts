import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Major from './models/major.entity';
import MajorService from './services/major.service';
import MajorController from './controllers/major.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Major])],
  providers: [MajorService],
  controllers: [MajorController],
})
export class MajorModule {}
