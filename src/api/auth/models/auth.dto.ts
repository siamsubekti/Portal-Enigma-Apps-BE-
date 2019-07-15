import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IApiResponse } from '../../../libraries/responses/response.interface';
import { ResponseStatus } from '../../../libraries/responses/response.class';

export class LoginCredentialDTO {
  @IsDefined()
  @IsNotEmpty()
  @ApiModelProperty({type: 'string', description: 'Login user email address or username', required: true})
  username: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiModelProperty({type: 'string', description: 'Login password related to the user.', required: true})
  password: string;
}

export class LoginResponseDTO {
  @ApiModelProperty({type: 'string', description: 'Account ID for the logged-in user.'})
  accountId: string;

  @ApiModelProperty({type: 'string', description: 'Session ID for the logged-in user.'})
  sessionId: string;
}

export class LoginResponse implements IApiResponse {
  @ApiModelProperty({type: ResponseStatus})
  status: ResponseStatus;

  @ApiModelProperty({type: LoginResponseDTO})
  data: LoginResponseDTO;
}

export class AccountRegisterDTO {
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiModelProperty({type: 'string', description: 'New candidate fullname.', required: true})
  fullname: string;

  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiModelProperty({type: 'string', description: 'New candidate email/username.', required: true})
  username: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  @ApiModelProperty({type: 'string', description: 'New candidate password.', required: true})
  password: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  @ApiModelProperty({type: 'string', description: 'New candidate password confirmation.', required: true})
  confirmPassword: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(10)
  @ApiModelProperty({type: 'string', description: 'New candidate phone number.', required: true})
  phone: string;
}

export class AccountRegisterResponseDTO {
  @ApiModelProperty({type: 'string', description: 'Newly created candidate account ID.'})
  accountId: string;

  @ApiModelProperty({type: 'string', description: 'Newly created candidate account activation status.'})
  status: string;
}

export class AccountRegisterResponse implements IApiResponse {
  @ApiModelProperty({type: ResponseStatus})
  status: ResponseStatus;

  @ApiModelProperty({type: AccountRegisterResponseDTO})
  data: AccountRegisterResponseDTO;
}

export class AccountRegistrationCredential {
  owner: string;
  key: string;
  token: string;
  activationLink: string;
}

export interface JwtPayload {
  accountId: string;
}

export interface JwtActivationPayload {
  account: AccountRegisterDTO;
  token: string;
}
