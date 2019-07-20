import { Controller, Get, UseInterceptors, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '../../libraries/responses/response.type';
import { ResponseStatus } from '../../libraries/responses/response.class';
import ResponseRebuildInterceptor from '../../libraries/responses/response.interceptor';
import AppConfig from '../../config/app.config';

@Controller()
export class ApiController {
  constructor(private readonly config: AppConfig) {}

  @Get('healthcheck')
  @UseInterceptors(ResponseRebuildInterceptor)
  @ApiUseTags('Default')
  @ApiOperation({title: 'Health Check', description: 'Enable API availability status checker.'})
  @ApiOkResponse({description: 'Generic Response', type: ApiResponse})
  async healthCheck(): Promise<{ status: ResponseStatus }> {
    Logger.debug('API HEALTH CHECKED', 'ApiController@healthCheck', true);
    return {
      status: {
        code: '200',
        description: `${this.config.get('API_NAME').toUpperCase()} IS ALIVE!`,
      },
    };
  }
}
