import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiOkResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { ResponseRebuildInterceptor } from '../../../libraries/responses/response.interceptor';
import CaptchaService from '../services/captcha.service';
import { CaptchaResponse, CaptchaResponseDTO } from '../models/register.dto';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';

@ApiUseTags('Authentication')
@Controller('auth')
export default class CaptchaController {
  constructor(private readonly captcha: CaptchaService) {}

  @Get('request')
  @UseInterceptors(ResponseRebuildInterceptor)
  @ApiOperation({ title: 'Request captcha.', description: 'Request to generate captcha.' })
  @ApiOkResponse({ description: 'Generated captcha response.', type: CaptchaResponse })
  @ApiInternalServerErrorResponse({ description: 'Internal server error.', type: ApiExceptionResponse })
  async getCaptcha(): Promise<CaptchaResponseDTO> {
    return await this.captcha.generate();
  }
}
