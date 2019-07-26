import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import Role from '../../roles/models/role.entity';
import Service from './service.entity';
import { RoleServiceDTO } from '../../roles/models/role.dto';

export class ServiceDTO {

  id: number;

  @ApiModelProperty({ uniqueItems: true })
  code: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  endpointUrl: string;

  @ApiModelProperty({ type: [RoleServiceDTO] })
  roles: Role[];

  createdAt: Date;
}

export class UpdateServiceDTO {

  @ApiModelProperty({ uniqueItems: true })
  code: string;

  @ApiModelProperty()
  name: string;

  @ApiModelProperty()
  endpointUrl: string;
}

export class ServiceResponse implements IApiResponse {
  @ApiModelProperty({ type: ResponseStatus })
  status: ResponseStatus;

  @ApiModelProperty({ type: ServiceDTO })
  data: ServiceDTO;
}

export class ServicePageResponse implements IApiPagedResponse {
  @ApiModelProperty({ type: PagingData })
  paging: PagingData;

  @ApiModelProperty({ type: ResponseStatus })
  status: ResponseStatus;

  @ApiModelProperty({ type: ServiceDTO })
  data: ServiceDTO[];

}

export class ServiceQueryDTO {
  term?: string;
  order?: 'username' | 'fullname' | 'nickname';
  sort?: 'asc' | 'desc';
  page?: number;
  rowsPerPage?: number;
}

export class ServiceQueryResult {
  result: Service[] | Service;
  totalRows: number;
}

export class ServiceResponses {
  status?: ResponseStatus;
  data: Service | Service[];
  paging?: PagingData;
}
