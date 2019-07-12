import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Parameter from './models/parameter.entity';
import { ParameterController } from './controllers/parameter.controller';
import { ParameterService } from './services/parameter.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Parameter])
    ],
    controllers: [
        ParameterController
    ],
    providers: [
        ParameterService
    ]
})
export class ParameterModule { }