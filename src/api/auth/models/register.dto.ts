import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, MaxLength, MinLength, Length } from 'class-validator';
import { IApiResponse } from '../../../libraries/responses/response.interface';
import { ResponseStatus } from '../../../libraries/responses/response.class';

export class CaptchaDTO {
  @ApiModelProperty({type: 'string', description: 'Captcha token.', required: true})
  @IsDefined()
  @IsNotEmpty()
  @Length(32)
  token: string;

  @ApiModelProperty({type: 'string', description: 'Captcha answer.', required: true})
  @IsDefined()
  @IsNotEmpty()
  @Length(5)
  answer: string;
}

export class CaptchaResponseDTO {
  @ApiModelProperty({type: 'string', description: 'Captcha token.', required: true})
  token: string;

  @ApiModelProperty({type: 'string', description: 'Captcha token.', required: true})
  image: string;
}

export class CaptchaResponse {
  @ApiModelProperty({type: ResponseStatus, description: 'Response status', required: true})
  status: ResponseStatus;

  @ApiModelProperty({type: CaptchaResponseDTO, description: 'Response data', required: true})
  data: CaptchaResponseDTO;
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

  @IsDefined()
  @IsNotEmpty()
  @ApiModelProperty({type: 'string', description: 'Birthdate.', required: true, example: '03-12-1995'})
  birthdate: Date;

  @IsDefined()
  @IsNotEmpty()
  @ApiModelProperty({type: CaptchaDTO, description: 'Captcha answer.', required: true })
  captcha: CaptchaDTO;
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
  account: AccountRegisterDTO;
  key: string;
  token: string;
}

export interface JwtActivationPayload {
  account: AccountRegisterDTO;
  token: string;
}
