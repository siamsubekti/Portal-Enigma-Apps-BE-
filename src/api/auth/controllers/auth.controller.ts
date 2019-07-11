import { Controller, Post, Body, Res } from '@nestjs/common';
import AuthService from '../services/auth.service';
import ResponseUtil from '../../../libraries/response/response.util';
import { ApiUseTags, ApiOperation, ApiCreatedResponse, ApiImplicitBody } from '@nestjs/swagger';
import { LoginCredentialDTO, LoginResponse, LoginResponseDTO } from '../models/auth.dto';
import { Response } from 'express';

@ApiUseTags('Authentication')
@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseUtil: ResponseUtil,
  ) {}

  @Post('login')
  @ApiOperation({title: 'User Login', description: 'User login service required before accessing other services.'})
  @ApiCreatedResponse({description: 'User successfuly logged-in.', type: LoginResponse})
  @ApiImplicitBody({name: 'LoginCredentialDTO', description: 'Candidate form data.', type: LoginCredentialDTO})
  async login(@Body() form: LoginCredentialDTO, @Res() response: Response): Promise<any> {
    const credential: LoginResponseDTO = await this.authService.login(form);
    const body: LoginResponse = this.responseUtil.rebuildResponse(credential);

    response.cookie('EPSESSION', credential.sessionId);
    return response.send(body);
  }
}
