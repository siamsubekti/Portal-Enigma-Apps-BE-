import { Controller, Post, Body, Delete, HttpCode } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiCreatedResponse, ApiImplicitBody, ApiBadRequestResponse } from '@nestjs/swagger';
import { AccountRegisterResponse, AccountRegisterDTO, AccountRegisterResponseDTO } from '../models/auth.dto';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import AuthService from '../services/auth.service';
import ResponseUtil from '../../../libraries/responses/response.util';

@ApiUseTags('Portal')
@Controller('portal')
export default class RegisterController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Post('register')
  @ApiOperation({title: 'Register Candidate.', description: 'Register new candidate based on received form data.'})
  @ApiCreatedResponse({description: 'Candidate successfuly registered.', type: AccountRegisterResponse})
  @ApiBadRequestResponse({description: 'Form data validation failed.', type: ApiExceptionResponse})
  @ApiImplicitBody({name: 'AccountRegisterDTO', description: 'Candidate form data.', type: AccountRegisterDTO})
  async register(@Body() form: AccountRegisterDTO): Promise<AccountRegisterResponse> {
    try {
      const account: AccountRegisterResponseDTO = await this.authService.register(form);

      return this.responseUtil.rebuildResponse(account, {code: '201', description: 'Created.'});
    } catch (exception) {
      throw exception;
    }
  }
}
