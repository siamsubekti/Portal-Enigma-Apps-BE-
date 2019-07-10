import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Region from './models/region.entity';
import { RegionController } from './controllers/region.controller';
import { RegionService } from './services/region.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Region])
    ],
    controllers: [
        RegionController
    ],
    providers: [
        RegionService
    ]
})
export class RegionsModule {}
