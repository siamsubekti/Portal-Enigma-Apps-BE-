import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
// import Service from '../../services/models/service.entity';
// import Menu from '../../menus/models/menu.entity';

export class RoleDTO {

  @ApiModelProperty()
  @IsNotEmpty()
  code: string;

  @ApiModelProperty()
  @IsNotEmpty()
  name: string;
}

export class RoleResponseDTO {
  @ApiModelProperty()
  code: string;

  @ApiModelProperty()
  name: string;
}

export class RoleResponse implements IApiResponse {
  @ApiModelProperty()
  status: ResponseStatus;
  @ApiModelProperty()
  data: RoleDTO;
}

export class RolePagedResponse implements IApiPagedResponse {
  @ApiModelProperty()
  status: ResponseStatus;
  @ApiModelProperty()
  data: RoleDTO[];
  @ApiModelProperty()
  paging: PagingData;
}

// export class RoleObject {

//     @ApiModelProperty()
//     id: number;

//     @ApiModelProperty()
//     code: string;

//     @ApiModelProperty()
//     name: string;

//     @ApiModelProperty()
//     createdAt: Date;

//     services: Service[];
// }
