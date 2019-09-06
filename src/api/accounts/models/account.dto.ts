import { IsNotEmpty, IsDefined, MinLength, MaxLength, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ResponseStatus, PagingData } from '../../../libraries/responses/response.class';
import { AccountStatus, ProfileGender, ProfileReligion, ProfileMaritalStatus, AccountType } from '../../../config/constants';
import Account from './account.entity';
import Role from '../../master/roles/models/role.entity';
import Menu from '../../master/menus/models/menu.entity';
import Service from '../../master/services/models/service.entity';

export class AccountDTO {
  username: string;
  password: string;
  confirmPassword: string;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class ProfileResponseDTO {
  @ApiModelProperty({ description: 'Account profile ID', type: 'string'})
  id: string;
  @ApiModelProperty({ description: 'Account profile fullname', type: 'string'})
  fullname: string;
  @ApiModelProperty({ description: 'Account profile nickname', type: 'string'})
  nickname: string;
  @ApiModelProperty({ description: 'Account profile email address', type: 'string'})
  email: string;
  @ApiModelProperty({ description: 'Account profile phone number', type: 'string'})
  phone: string;
  @ApiModelProperty({ description: 'Account profile birthdate', type: 'string'})
  birthdate: Date;
  @ApiModelProperty({ description: 'Account profile gender', enum: ProfileGender})
  gender: ProfileGender;
  @ApiModelProperty({ description: 'Account profile gender', enum: ProfileReligion})
  religion: ProfileReligion;
  @ApiModelProperty({ description: 'Account profile gender', enum: ProfileMaritalStatus})
  maritalStatus: ProfileMaritalStatus;
  @ApiModelProperty({ description: 'Account profile creation date', type: 'string'})
  createdAt: Date;
  @ApiModelProperty({ description: 'Account profile update date', type: 'string'})
  updatedAt: Date;
}

export class AccountResponseDTO {
  @ApiModelProperty({ description: 'Account ID', type: 'string'})
  id: string;
  @ApiModelProperty({ description: 'Account username', type: 'string'})
  username: string;
  @ApiModelProperty({ description: 'Account status', enum: AccountStatus })
  status: AccountStatus;
  @ApiModelProperty({ description: 'Account type', type: AccountType})
  accountType: AccountType;
  @ApiModelProperty({ description: 'Account creation date', type: 'string'})
  createdAt: Date;
  @ApiModelProperty({ description: 'Account update date', type: 'string'})
  updatedAt: Date;
  @ApiModelProperty({ description: 'Account last login date', type: 'string'})
  lastlogin: Date;
  @ApiModelProperty({ description: 'Account profile data', type: ProfileResponseDTO})
  profile: ProfileResponseDTO;
  @ApiModelProperty({ description: 'Account profile data', type: [Role]})
  roles: Role[];
}

export class AccountProfileDTO {
  @ApiModelProperty({ description: 'Account username, usually email address.', type: 'string', required: true, uniqueItems: true })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
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
  @IsEmail()
  email: string;

  @ApiModelProperty({ description: 'Account phone.', type: 'string', required: true })
  @IsDefined()
  @IsNotEmpty()
  phone: string;

  @ApiModelProperty({ description: 'Account birthdate.', type: 'string', required: true, example: '31-12-1991' })
  @IsDefined()
  @IsNotEmpty()
  birthdate: Date;

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

  @ApiModelProperty({ description: 'Account Type', type: 'string', enum: AccountType, required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiModelProperty({ type: [Role], required: false})
  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  roles?: Role[];

  @ApiModelProperty({ type: 'string', required: false})
  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  newPassword?: string;

  @ApiModelProperty({ type: 'string', required: false})
  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  confirmPassword?: string;

  @ApiModelProperty({ type: 'string', required: false})
  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  currentPassword?: string;
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

export class AccountSearchResponse {
  @ApiModelProperty({ description: 'Response status', type: ResponseStatus, required: false})
  status?: ResponseStatus;

  @ApiModelProperty({ description: 'Account data', type: [ AccountResponseDTO ], required: true })
  data: AccountResponseDTO[];
}

export class AccountResponse {
  @ApiModelProperty({ description: 'Response status', type: ResponseStatus, required: false})
  status?: ResponseStatus;

  @ApiModelProperty({ description: 'Account data', type: AccountResponseDTO, required: true })
  data: AccountResponseDTO;
}

export class AccountPagedResponse {
  @ApiModelProperty({ description: 'Response status', type: ResponseStatus, required: false})
  status?: ResponseStatus;

  @ApiModelProperty({ description: 'List of accounts', type: [ AccountResponseDTO ], required: true })
  data: AccountResponseDTO[];

  @ApiModelProperty({ description: 'Paging data', type: PagingData, required: false })
  paging?: PagingData;
}
