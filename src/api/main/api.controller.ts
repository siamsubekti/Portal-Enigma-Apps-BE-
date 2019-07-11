import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOkResponse, ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CookieAuthGuard } from '../auth/guards/cookie.guard';

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
