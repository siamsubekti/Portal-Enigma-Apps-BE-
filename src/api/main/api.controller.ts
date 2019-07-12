import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOkResponse, ApiUseTags, ApiOperation } from '@nestjs/swagger';

@Controller()
export class ApiController {
  constructor(private readonly service: ApiService) {}

  @Get()
  getHello(): string {
    return this.service.getHello();
  }
}
