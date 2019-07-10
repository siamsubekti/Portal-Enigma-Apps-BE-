import { Module } from '@nestjs/common';
import { SkillsController } from './controllers/skills.controller';
import { SkillService } from './services/skill.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Skill from './models/skill.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Skill])
  ],
  controllers: [SkillsController],
  providers: [SkillService]
})
export class SkillsModule { }
