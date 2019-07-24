import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service';

describe('Template Service', () => {
  let controller: TemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateService],
    }).compile();

    controller = module.get<TemplateService>(TemplateService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
