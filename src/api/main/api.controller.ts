import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiService } from './api.service';
import { ApiOkResponse, ApiUseTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CookieAuthGuard } from '../auth/guards/cookie.guard';
import { ResponseRebuildInterceptor } from '../../libraries/responses/response.interceptor';

@Controller()
export class ApiController {
  constructor(private readonly service: ApiService) {}

  @Get()
  getHello(): string {
    return this.service.getHello();
  }

  @Get('response/single')
  @ApiUseTags('Default')
  @UseInterceptors(ResponseRebuildInterceptor)
  testSingleResponse(): Promise<any> {
    return this.service.getSingleResponse();
  }

  @Get('response/array')
  @ApiUseTags('Default')
  @UseInterceptors(ResponseRebuildInterceptor)
  testArrayResponse(): Promise<any> {
    return this.service.getArrayResponse();
  }
}
