import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Academy from './models/academy.entity';
import { AcademyService } from './services/academy.service';
import { AcademyController } from './controllers/academy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Academy])],
  providers: [AcademyService],
  controllers: [AcademyController],
})
export class AcademyModule {}
