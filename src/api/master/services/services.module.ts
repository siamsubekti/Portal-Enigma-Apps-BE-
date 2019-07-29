import { Module } from '@nestjs/common';
import ServicesController from './controllers/services.controller';
import ServicesService from './services/services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Service from './models/service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
  ],
  controllers: [ServicesController],
  exports: [ServicesService],
  providers: [ServicesService],
})
export default class ServicesModule { }
