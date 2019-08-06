import { IsNotEmpty, IsDefined, MinLength, MaxLength, IsEmail, IsEnum } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ResponseStatus, PagingData } from '../../../libraries/responses/response.class';
import Account from './account.entity';
import Role from '../../master/roles/models/role.entity';
import Menu from '../../master/menus/models/menu.entity';
import Service from '../../master/services/models/service.entity';
import { AccountStatus, ProfileGender, ProfileReligion, ProfileMaritalStatus } from '../../../config/constants';

export class AccountResponse {
  @ApiModelProperty({ description: 'Response status', type: ResponseStatus, required: false})
  status?: ResponseStatus;

  @ApiModelProperty({ description: 'Account data', type: Account, required: true })
  data: Account;
}

export class AccountPagedResponse {
  @ApiModelProperty({ description: 'Response status', type: ResponseStatus, required: false})
  status?: ResponseStatus;

  @ApiModelProperty({ description: 'List of accounts', type: [ Account ], required: true })
  data: Account[];

  @ApiModelProperty({ description: 'Paging data', type: PagingData, required: false })
  paging?: PagingData;
}

export class AccountDTO {
  username: string;
  password: string;
  confirmPassword: string;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class AccountProfileDTO {
  @ApiModelProperty({ description: 'Account username, usually email address.', type: 'string', required: true, uniqueItems: true })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  username: string;

  @ApiModelProperty({ description: 'Account fullname.', type: 'string', required: true })
  @IsDefined()
  @IsNotEmpty()
  fullname: string;

  @ApiModelProperty({ description: 'Account nickname.', type: 'string', required: true, uniqueItems: true })
  @IsDefined()
  @IsNotEmpty()
  nickname: string;

  @ApiModelProperty({ description: 'Account email.', type: 'string', required: true, uniqueItems: true })
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @ApiModelProperty({ description: 'Account phone.', type: 'string', required: true })
  @IsDefined()
  @IsNotEmpty()
  phone: string;

  @ApiModelProperty({ description: 'Account birthdate.', type: 'string', required: true })
  @IsDefined()
  @IsNotEmpty()
  birthdate: string;

  @ApiModelProperty({ description: 'Account gender.', type: 'string', enum: ProfileGender, required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(ProfileGender)
  gender: ProfileGender;

  @ApiModelProperty({ description: 'Account religion.', type: 'string', enum: ProfileReligion, required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(ProfileReligion)
  religion: ProfileReligion;

  @ApiModelProperty({ description: 'Account marital status.', type: 'string', enum: ProfileMaritalStatus, required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(ProfileMaritalStatus)
  maritalStatus: ProfileMaritalStatus;

  @ApiModelProperty({ type: Role, required: false})
  @IsDefined()
  roles: Role[];
}

export class AccountQueryDTO {
  term?: string;
  order?: 'username' | 'fullname' | 'nickname';
  sort?: 'asc' | 'desc';
  page?: number;
  rowsPerPage?: number;
}

export class AccountQueryResult<T> {
  result: T;
  totalRows: number;
}

export class AccountPrivilege {
  account: Account;
  roles: Role[];
  menus: Menu[];
  services: Service[];
}

export class AccountPrivilegeResponse {
  status?: ResponseStatus;
  data: AccountPrivilege;
}
