import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';
import { ResponseStatus } from '../../../libraries/responses/response.class';
import { AccountStatus } from '../../../config/constants';
import { ServiceDTO } from '../../master/services/models/service.dto';

export class LoginCredentialDTO {
  @IsDefined()
  @IsNotEmpty()
  @ApiModelProperty({type: 'string', description: 'Login user email address or username', required: true})
  username: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiModelProperty({type: 'string', description: 'Login password related to the user.', required: true})
  password: string;

  candidate?: boolean;
}

export class LoginResponseDTO {
  @ApiModelProperty({type: 'string', description: 'Account ID for the logged-in user.'})
  accountId: string;

  @ApiModelProperty({enum: AccountStatus, description: 'Account status for logged-in user.', default: AccountStatus.ACTIVE})
  accountStatus: AccountStatus;

  @ApiModelProperty({type: 'string', description: 'Session ID for the logged-in user.', required: false})
  sessionId: string;

  @ApiModelProperty({type: ServiceDTO, description: 'Service endpoint to get privileges.', required: false})
  redirectTo?: ServiceDTO;
}

export class LoginResponse {
  @ApiModelProperty({type: ResponseStatus})
  status?: ResponseStatus;

  @ApiModelProperty({type: LoginResponseDTO})
  data: LoginResponseDTO;
}

export class AuthServicesResponse {
  @ApiModelProperty({type: ResponseStatus})
  status?: ResponseStatus;

  @ApiModelProperty({type: [ServiceDTO], description: 'Auth service endpoints.'})
  data: ServiceDTO[];
}

export interface JwtPayload {
  aid: string;
}
