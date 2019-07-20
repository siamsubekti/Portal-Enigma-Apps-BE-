import { Controller, Post, Body, Res, ForbiddenException, Delete, UseGuards, Req, NotFoundException, Put, Param, UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';
import {
  ApiUseTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiImplicitBody,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiImplicitParam,
} from '@nestjs/swagger';
import { LoginCredentialDTO, LoginResponse, LoginResponseDTO } from '../models/auth.dto';
import { PasswordResetRequestDTO, PasswordResetDTO } from '../models/password-reset.dto';
import { ApiExceptionResponse, ApiResponse } from '../../../libraries/responses/response.type';
import ResponseUtil from '../../../libraries/responses/response.util';
import AuthService from '../services/auth.service';
import CookieAuthGuard from '../guards/cookie.guard';
import AppConfig from '../../../config/app.config';
import ResponseRebuildInterceptor from '../../../libraries/responses/response.interceptor';

@ApiUseTags('Authentication')
@Controller('auth')
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseUtil: ResponseUtil,
    private readonly config: AppConfig,
  ) {}

  @Post('login')
  @ApiOperation({title: 'User Login', description: 'User login service required before accessing other services.'})
  @ApiCreatedResponse({description: 'User successfuly logged-in.', type: LoginResponse})
  @ApiForbiddenResponse({description: 'Invalid user account credential.', type: ApiExceptionResponse})
  @ApiBadRequestResponse({description: 'Form data validation failed.', type: ApiExceptionResponse})
  @ApiImplicitBody({name: 'LoginCredentialDTO', description: 'User account form data.', type: LoginCredentialDTO})
  async login(@Body() form: LoginCredentialDTO, @Res() response: Response): Promise<void> {
    const credential: LoginResponseDTO = await this.authService.login(form);

    if (credential) {
      const body: LoginResponse = this.responseUtil.rebuildResponse(credential);
      response.cookie('EPSESSION', credential.sessionId, {
        maxAge: Number(this.config.get('SESSION_EXPIRES')),
        httpOnly: true,
        secure: true,
      });
      response.json(body);
    } else
      throw new ForbiddenException('Invalid account credential.');
  }

  @Delete('logout')
  @UseGuards(CookieAuthGuard)
  @ApiOperation({title: 'User Logout', description: 'Destroy any session related to the current user.'})
  @ApiNoContentResponse({description: 'User successfuly logged-out.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized logout', type: ApiExceptionResponse})
  @ApiNotFoundResponse({description: 'Session invalid', type: ApiExceptionResponse})
  async logout(@Req() request: Request, @Res() response: Response): Promise<void> {
    const { EPSESSION: sessionId } = request.cookies;
    const loggedOut: boolean = await this.authService.logout(sessionId);

    if (loggedOut) response.sendStatus(204);
    else throw new NotFoundException('Session ID is invalid.');
  }

  @Post('password-reset')
  @UseInterceptors(ResponseRebuildInterceptor)
  @ApiOperation({title: 'User Password Reset', description: 'Request to reset user password.'})
  @ApiImplicitBody({name: 'PasswordResetRequestDTO', description: 'Password reset request form data.', type: PasswordResetRequestDTO})
  @ApiCreatedResponse({description: 'Successful request to reset password.', type: ApiResponse})
  @ApiBadRequestResponse({description: 'User account email validation failed.', type: ApiExceptionResponse})
  async passwordResetRequest(@Body() form: PasswordResetRequestDTO): Promise<boolean> {
    await this.authService.prePasswordReset(form);

    return true;
  }

  @Put('password-reset/:key/:token')
  @UseInterceptors(ResponseRebuildInterceptor)
  @ApiOperation({title: 'User Password Update', description: 'Update user password.'})
  @ApiImplicitParam({name: 'token', description: 'Activation token.', required: true})
  @ApiImplicitParam({name: 'key', description: 'Activation key.', required: true})
  @ApiImplicitBody({name: 'PasswordResetDTO', description: 'Password reset form data.', type: PasswordResetDTO})
  @ApiOkResponse({description: 'User password updated successfuly.', type: ApiResponse})
  @ApiBadRequestResponse({description: 'User password reset form validation failed.', type: ApiExceptionResponse})
  async passwordResetUpdate(@Body() form: PasswordResetDTO, @Param('key') key: string, @Param('token') token: string): Promise<boolean> {
    await this.authService.passwordReset(form, key, token);

    return true;
  }
}
