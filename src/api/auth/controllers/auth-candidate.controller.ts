import { Response, Request } from 'express';
import {
    UseGuards,
    Controller,
    Param,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Res,
    Req,
    ForbiddenException,
    NotFoundException,
    UseInterceptors,
    HttpStatus,
} from '@nestjs/common';
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
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ResponseRebuildInterceptor } from '../../../libraries/responses/response.interceptor';
import { ResponseStatus } from '../../../libraries/responses/response.class';
import { LoginCredentialDTO, LoginResponse, LoginResponseDTO, AuthServicesResponse } from '../models/auth.dto';
import { PasswordResetRequestDTO, PasswordResetDTO, PasswordResetResponse } from '../models/password-reset.dto';
import { ApiExceptionResponse } from '../../../libraries/responses/response.type';
import { AccountStatus } from '../../../config/constants';
import ResponseUtil from '../../../libraries/responses/response.util';
import AuthService from '../services/auth.service';
import CookieAuthGuard from '../guards/cookie.guard';
import AppConfig from '../../../config/app.config';
import Service from '../../master/services/models/service.entity';

@ApiUseTags('Authentication')
@Controller('auth/candidate')
export default class AuthCandidateController {
    constructor(
        private readonly authService: AuthService,
        private readonly responseUtil: ResponseUtil,
        private readonly config: AppConfig,
    ) { }

    @Post('login')
    @ApiOperation({ title: 'Candidate Login', description: 'Candidate login service required before accessing other services.' })
    @ApiCreatedResponse({ description: 'Candidate successfuly logged-in.', type: LoginResponse })
    @ApiForbiddenResponse({ description: 'Invalid candidate account credential.', type: ApiExceptionResponse })
    @ApiBadRequestResponse({ description: 'Form data validation failed.', type: ApiExceptionResponse })
    @ApiUnprocessableEntityResponse({ description: 'New account in suspended status.', type: ApiExceptionResponse })
    @ApiImplicitBody({ name: 'LoginCredentialDTO', description: 'Candidate account form data.', type: LoginCredentialDTO })
    async login(@Body() form: LoginCredentialDTO, @Res() response: Response): Promise<void> {
        form.candidate = true;
        const credential: LoginResponseDTO = await this.authService.login(form);

        if (credential && credential.accountStatus === AccountStatus.ACTIVE) {
            const body: LoginResponse = this.responseUtil.rebuildResponse(credential);
            response.cookie('EPSESSION', credential.sessionId, {
                maxAge: Number(this.config.get('SESSION_EXPIRES')),
                httpOnly: true,
                secure: true,
            });

            response.json(body);
        } else if (credential && credential.accountStatus === AccountStatus.SUSPENDED && credential.sessionId) {
            const resStatus: ResponseStatus = {
                code: HttpStatus.UNPROCESSABLE_ENTITY.toString(),
                description: 'Account password must be changed.',
            };
            const body: LoginResponse = this.responseUtil.rebuildResponse(credential, resStatus);

            response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(body);
        } else if (credential && credential.accountStatus === AccountStatus.SUSPENDED && !credential.sessionId)
            throw new ForbiddenException('Your account is being suspended.');
        else
            throw new ForbiddenException('Invalid account credential.');
    }

    @Delete('logout')
    @UseGuards(CookieAuthGuard)
    @ApiOperation({ title: 'Candidate Logout', description: 'Destroy any session related to the current candidate.' })
    @ApiNoContentResponse({ description: 'Candidate successfuly logged-out.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized logout', type: ApiExceptionResponse })
    @ApiNotFoundResponse({ description: 'Session invalid', type: ApiExceptionResponse })
    async logout(@Req() request: Request, @Res() response: Response): Promise<void> {
        const { EPSESSION: sessionId } = request.cookies;
        const loggedOut: boolean = await this.authService.logout(sessionId);

        if (loggedOut) response.sendStatus(204);
        else throw new NotFoundException('Session ID is invalid.');
    }

    @Put('password/reset/:key/:token')
    @UseInterceptors(ResponseRebuildInterceptor)
    @ApiOperation({ title: 'Account Password Update', description: 'Update candidate account password (can also be used to reset new backoffice candidate account password).' })
    @ApiImplicitParam({ name: 'key', description: 'Activation key.', required: true })
    @ApiImplicitParam({ name: 'token', description: 'Activation token.', required: true })
    @ApiImplicitBody({ name: 'PasswordResetDTO', description: 'Password reset form data.', type: PasswordResetDTO })
    @ApiOkResponse({ description: 'Account password changed.', type: LoginResponse })
    @ApiBadRequestResponse({ description: 'Candidate password reset form validation failed.', type: ApiExceptionResponse })
    async passwordResetUpdate(@Body() form: PasswordResetDTO, @Param('key') key: string, @Param('token') token: string): Promise<LoginResponse> {
        const data: LoginResponseDTO = await this.authService.passwordReset(form, key, token);

        return { data };
    }

    @Post('password/reset')
    @UseInterceptors(ResponseRebuildInterceptor)
    @ApiOperation({ title: 'Candidate Password Reset', description: 'Request to reset candidate password.' })
    @ApiImplicitBody({ name: 'PasswordResetRequestDTO', description: 'Password reset request form data.', type: PasswordResetRequestDTO })
    @ApiCreatedResponse({ description: 'Successful request to reset password.', type: PasswordResetResponse })
    @ApiBadRequestResponse({ description: 'Candidate account email validation failed.', type: ApiExceptionResponse })
    async passwordResetRequest(@Body() form: PasswordResetRequestDTO): Promise<PasswordResetResponse> {
        form.candidate = true;
        const data: boolean = await this.authService.prePasswordReset(form);

        return { status: { code: '201', description: 'Please check your email and follow the instructions.' }, data };
    }

    @Get('services')
    @UseInterceptors(ResponseRebuildInterceptor)
    @ApiOperation({ title: 'Available Auth Services', description: 'Get a list of available candidate auth services.' })
    @ApiOkResponse({ description: 'List of auth services.', type: AuthServicesResponse })
    async services(): Promise<AuthServicesResponse> {
        const data: Service[] = await this.authService.getFrontofficeAuthService();

        return { data };
    }
}
