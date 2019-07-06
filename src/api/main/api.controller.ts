import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOkResponse, ApiUseTags, ApiOperation } from '@nestjs/swagger';

@Controller()
export class ApiController {
  constructor(private readonly service: ApiService) {}

  @Get()
  @ApiUseTags('Default')
  @ApiOperation({title: 'Greeting', description: 'API Greeting Response'})
  @ApiOkResponse({description: 'Halo', type: 'string'})
  getHello(): string {
    return this.service.getHello();
  }
}
