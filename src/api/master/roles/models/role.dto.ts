import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import Service from '../../services/models/service.entity';
import Role from './role.entity';
import Menu from '../../menus/models/menu.entity';

export class RoleDTO {

  @ApiModelProperty()
  @IsNotEmpty()
  code: string;

  @ApiModelProperty()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty({type: [Service]})
  services: Service[];

  @ApiModelProperty({type: [Menu]})
  menus: Menu[];
}

export class RoleResponseDTO {
  @ApiModelProperty()
  code: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  services: Service[];
}

export class RoleIdDTO {
  @ApiModelProperty()
  id: number;

}

export class RoleResponse {
  @ApiModelProperty()
  status?: ResponseStatus;
  @ApiModelProperty()
  data: Role | Role[];
  @ApiModelProperty()
  paging?: PagingData;
}

export class RolePagedResponse {
  @ApiModelProperty()
  status?: ResponseStatus;
  @ApiModelProperty()
  data: Role[] | Role;
  @ApiModelProperty()
  paging?: PagingData;
}

export class RoleQueryDTO {
  term?: string;
  order?: 'code' | 'name';
  sort?: 'asc' | 'desc';
  page?: number;
  rowsPerPage?: number;
}

export class RoleQueryResult {
  result: Role[] | Role;
  totalRows: number;
}
