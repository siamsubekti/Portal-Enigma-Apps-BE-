import { Controller, Post, Body, Delete, HttpCode, Get, Param } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiCreatedResponse, ApiImplicitBody, ApiBadRequestResponse, ApiImplicitParam } from '@nestjs/swagger';
import { AccountRegisterResponse, AccountRegisterDTO, AccountRegisterResponseDTO } from '../models/auth.dto';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import AuthService from '../services/auth.service';
import ResponseUtil from '../../../libraries/responses/response.util';

@ApiUseTags('Portal')
@Controller('candidate')
export default class RegisterController {
  constructor( private readonly authService: AuthService ) {}

  @Post('register')
  @ApiOperation({title: 'Register Candidate.', description: 'Register new candidate based on received form data.'})
  @ApiCreatedResponse({description: 'Candidate successfuly registered.', type: AccountRegisterResponse})
  @ApiBadRequestResponse({description: 'Form data validation failed.', type: ApiExceptionResponse})
  @ApiImplicitBody({name: 'AccountRegisterDTO', description: 'Candidate form data.', type: AccountRegisterDTO})
  async register(@Body() form: AccountRegisterDTO): Promise<AccountRegisterResponseDTO> {
    try {
      return await this.authService.preRegister(form);
    } catch (exception) {
      throw exception;
    }
  }

  @Get('activation/:key/:token')
  @ApiOperation({title: 'Activate Candidate Account.', description: 'Activate new candidate account based on two parameters.'})
  @ApiImplicitParam({name: 'token', description: 'Activation token.', required: true})
  @ApiImplicitParam({name: 'key', description: 'Activation key.', required: true})
  @ApiCreatedResponse({description: 'Candidate account successfuly activated.', type: AccountRegisterResponse})
  @ApiBadRequestResponse({description: 'Parameter validation failed.', type: ApiExceptionResponse})
  async activate(@Param('key') key: string, @Param('token') token: string): Promise<AccountRegisterResponseDTO> {
    try {
      const account: AccountRegisterDTO = await this.authService.preActivation(key, token);
      return await this.authService.register(key, account);

    } catch (exception) {
      throw exception;
    }
  }
}
