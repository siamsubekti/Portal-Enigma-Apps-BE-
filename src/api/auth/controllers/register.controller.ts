import { Controller, Post, Body, Delete, HttpCode, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiCreatedResponse, ApiImplicitBody, ApiBadRequestResponse, ApiImplicitParam } from '@nestjs/swagger';
import { AccountRegisterResponse, AccountRegisterDTO, AccountRegisterResponseDTO } from '../models/register.dto';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import { ResponseRebuildInterceptor } from '../../../libraries/responses/response.interceptor';
import RegisterService from '../services/register.service';

@ApiUseTags('Portal')
@Controller('candidate')
@UseInterceptors(ResponseRebuildInterceptor)
export default class RegisterController {
  constructor(private readonly registerService: RegisterService) { }

  @Post('register')
  @ApiOperation({ title: 'Register Candidate.', description: 'Register new candidate based on received form data.' })
  @ApiCreatedResponse({ description: 'Candidate successfuly registered.', type: AccountRegisterResponse })
  @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
  @ApiImplicitBody({ name: 'AccountRegisterDTO', description: 'Candidate form data.', type: AccountRegisterDTO })
  async register(@Body() form: AccountRegisterDTO): Promise<AccountRegisterResponseDTO> {
    try {
      return await this.registerService.preRegister(form);
    } catch (exception) {
      throw exception;
    }
  }

  @Post('activation/:key/:token')
  @ApiOperation({ title: 'Activate Candidate Account.', description: 'Activate new candidate account based on two parameters.' })
  @ApiImplicitParam({ name: 'token', description: 'Activation token.', required: true })
  @ApiImplicitParam({ name: 'key', description: 'Activation key.', required: true })
  @ApiCreatedResponse({ description: 'Candidate account successfuly activated.', type: AccountRegisterResponse })
  @ApiBadRequestResponse({ description: 'Parameter validation failed.', type: ApiExceptionResponse })
  async activate(@Param('key') key: string, @Param('token') token: string): Promise<AccountRegisterResponseDTO> {
    try {
      const account: AccountRegisterDTO = await this.registerService.preActivation(key, token);
      return await this.registerService.register(key, account);

    } catch (exception) {
      throw exception;
    }
  }
}
