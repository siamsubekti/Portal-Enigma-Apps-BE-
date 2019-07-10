import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Template from './models/template.entity';
import { TemplateController } from './controllers/template.controller';
import { TemplateService } from './services/template.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Template])
    ],
    controllers: [TemplateController],
    providers: [TemplateService]
})

export class TemplateModule { }