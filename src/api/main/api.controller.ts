import { Controller, Get, UseInterceptors, Logger, Req } from '@nestjs/common';
import { ApiOkResponse, ApiUseTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ApiResponse } from '../../libraries/responses/response.type';
import { ResponseStatus } from '../../libraries/responses/response.class';
import ResponseRebuildInterceptor from '../../libraries/responses/response.interceptor';
import AppConfig from '../../config/app.config';

@Controller()
@UseInterceptors(ResponseRebuildInterceptor)
export class ApiController {
  constructor(private readonly config: AppConfig) {}

  @Get('healthcheck')
  @ApiUseTags('Default')
  @ApiOperation({title: 'Health Check', description: 'Enable API availability status checker.'})
  @ApiOkResponse({description: 'Generic Response', type: ApiResponse})
  async healthCheck(): Promise<{ status: ResponseStatus, data: any }> {
    Logger.debug('API HEALTH CHECKED', 'ApiController@healthCheck', true);
    return {
      status: {
        code: '200',
        description: `${this.config.get('API_NAME').toUpperCase()} IS ALIVE!`,
      },
      data: undefined,
    };
  }

  @Get('token')
  @ApiExcludeEndpoint()
  @ApiUseTags('Authentication')
  @ApiOperation({title: 'Retrieve CSRF Token', description: 'Endpoint to generate CSRF Token to make POST, PUT, DELETE requests.'})
  @ApiOkResponse({description: 'Token response', type: ApiResponse})
  async token(@Req() request: any): Promise<{key: string}> {
    request.csrfToken();
    return {
      key: this.config.get('CSRF_TOKEN_NAME'),
    };
  }
}
