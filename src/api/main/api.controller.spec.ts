import { Test, TestingModule } from '@nestjs/testing';
import { ApiController } from './api.controller';
import AppConfig from '../../config/app.config';

describe('AppController', () => {
  let apiController: ApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiController],
      providers: [AppConfig],
    }).compile();

    apiController = app.get<ApiController>(ApiController);
  });

  describe('root', () => {
    it('should return "Generic Response"', () => {
      expect(apiController.healthCheck()).toBe('Generic Response!');
    });
  });
});
