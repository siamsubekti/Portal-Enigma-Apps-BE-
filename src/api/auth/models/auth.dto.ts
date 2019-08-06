import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsEmail } from 'class-validator';
import { IApiResponse } from '../../../libraries/responses/response.interface';
import { ResponseStatus } from '../../../libraries/responses/response.class';
import Service from '../../master/services/models/service.entity';

export class LoginCredentialDTO {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
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

  @ApiModelProperty({type: Service, description: 'Service endpoint to get privileges.'})
  redirectTo: Service;
}

export class LoginResponse implements IApiResponse {
  @ApiModelProperty({type: ResponseStatus})
  status: ResponseStatus;

  @ApiModelProperty({type: LoginResponseDTO})
  data: LoginResponseDTO;
}

export interface JwtPayload {
  accountId: string;
}
