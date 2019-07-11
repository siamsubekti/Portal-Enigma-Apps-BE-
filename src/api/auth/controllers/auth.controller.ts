import { Controller, Post, Body, Res, ForbiddenException, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiUseTags, ApiOperation, ApiCreatedResponse, ApiImplicitBody, ApiBadRequestResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiUnauthorizedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { LoginCredentialDTO, LoginResponse, LoginResponseDTO } from '../models/auth.dto';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import ResponseUtil from '../../../libraries/responses/response.util';
import AuthService from '../services/auth.service';
import { CookieAuthGuard } from '../guards/cookie.guard';

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
  @ApiForbiddenResponse({description: 'Invalid user account credential.', type: ApiExceptionResponse})
  @ApiBadRequestResponse({description: 'Form data validation failed.', type: ApiExceptionResponse})
  @ApiImplicitBody({name: 'LoginCredentialDTO', description: 'User account form data.', type: LoginCredentialDTO})
  async login(@Body() form: LoginCredentialDTO, @Res() response: Response) {
    const credential: LoginResponseDTO = await this.authService.login(form);

    if (credential) {
      const body: LoginResponse = this.responseUtil.rebuildResponse(credential);
      response.cookie('EPSESSION', credential.sessionId);
      response.send(body);
    } else
      throw new ForbiddenException('Invalid account credential.');
  }

  @Delete('logout')
  @UseGuards(CookieAuthGuard)
  @ApiOperation({title: 'User Logout', description: 'Destroy any session related to the current user.'})
  @ApiNoContentResponse({description: 'User successfuly logged-out.'})
  @ApiUnauthorizedResponse({description: 'Unauthorized logout', type: ApiExceptionResponse})
  @ApiNotFoundResponse({description: 'Session invalid', type: ApiExceptionResponse})
  async logout(@Req() request: Request, @Res() response: Response) {
    const { EPSESSION: sessionId } = request.cookies;
    const loggedOut: boolean = await this.authService.logout(sessionId);

    if (loggedOut) response.sendStatus(204);
    else throw new NotFoundException('Session ID is invalid.');
  }
}
