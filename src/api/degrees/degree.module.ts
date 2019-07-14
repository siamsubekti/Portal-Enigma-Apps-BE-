import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Degree from './models/degree.entity';
import { DegreeService } from './services/degree.service';
import { DegreeController } from './controllers/degree.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Degree])],
    providers: [DegreeService],
    controllers: [DegreeController],
})
export class DegreeModule {}
