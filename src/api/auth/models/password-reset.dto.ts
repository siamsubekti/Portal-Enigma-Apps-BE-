import { IsDefined, IsNotEmpty, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import Account from '../../accounts/models/account.entity';
import { ResponseStatus } from '../../../libraries/responses/response.class';

export class PasswordResetRequestDTO {
  @IsDefined()
  @IsNotEmpty()
  @ApiModelProperty({type: 'string', description: 'Login user email address or username', required: true})
  username: string;
}

export class PasswordResetDTO {
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  @ApiModelProperty({type: 'string', description: 'New account password.', required: true})
  password: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  @ApiModelProperty({type: 'string', description: 'New account password confirmation.', required: true})
  confirmPassword: string;
}

export class PasswordResetResponse {
  @ApiModelProperty({type: ResponseStatus})
  status?: ResponseStatus;

  @ApiModelProperty({type: 'boolean'})
  data: boolean;
}

export class PasswordResetCredential {
  account: Account;
  key: string;
  token: string;
}

export class PasswordResetPayload {
  aid: string;
  token: string;
}
