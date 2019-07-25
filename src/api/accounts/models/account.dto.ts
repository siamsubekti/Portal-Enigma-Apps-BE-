import { IsNotEmpty, IsDefined, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { ResponseStatus, PagingData } from '../../../libraries/responses/response.class';
import Account from './account.entity';
import Role from '../../master/roles/models/role.entity';
import Menu from '../../master/menus/models/menu.entity';
import Service from '../../master/services/models/service.entity';

export class AccountResponse {
  status?: ResponseStatus;
  data: Account | Account[];
  paging?: PagingData;
}

export class AccountDTO {
  username: string;
  password: string;
  confirmPassword: string;
  status: 'INACTIVE' | 'ACTIVE' | 'SUSPENDED' | 'BLACKLISTED';
  createdAt: Date;
  updatedAt: Date;
}

export class AccountProfileDTO {
  @ApiModelProperty({ description: 'Account username, usually email address.', type: 'string', required: true })
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

  @ApiModelProperty({ description: 'Account nickname.', type: 'string', required: true })
  @IsDefined()
  @IsNotEmpty()
  nickname: string;

  @ApiModelProperty({ description: 'Account email.', type: 'string', required: true })
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

  @ApiModelProperty({ description: 'Account gender.', type: 'string', enum: ['MALE', 'FEMALE'], required: true })
  @IsDefined()
  @IsNotEmpty()
  gender: 'MALE' | 'FEMALE';

  @ApiModelProperty({ description: 'Account religion.', type: 'string', enum: ['BUDDHA', 'HINDU', 'ISLAM', 'KONG HU CHU', 'CHRISTIAN', 'CATHOLIC'], required: true })
  @IsDefined()
  @IsNotEmpty()
  religion: 'BUDDHA' | 'HINDU' | 'ISLAM' | 'KONG HU CHU' | 'CHRISTIAN' | 'CATHOLIC';

  @ApiModelProperty({ description: 'Account marital status.', type: 'string', enum: ['SINGLE', 'IN RELATIONSHIP', 'MARRIED', 'DIVORCED'], required: true })
  @IsDefined()
  @IsNotEmpty()
  maritalStatus: 'SINGLE' | 'IN RELATIONSHIP' | 'MARRIED' | 'DIVORCED';
}

export class AccountQueryDTO {
  term?: string;
  order?: 'username' | 'fullname' | 'nickname';
  sort?: 'asc' | 'desc';
  page?: number;
  rowsPerPage?: number;
}

export class AccountQueryResult {
  result: Account[] | Account;
  totalRows: number;
}

export class AccountPrivilege {
  roles: Role[];
  menus: Menu[];
  services: Service[];
}
