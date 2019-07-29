import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import Service from './service.entity';
import { IsNotEmpty, IsDefined, MaxLength } from 'class-validator';

export class ServiceDTO {

  @ApiModelProperty({ type: 'string', uniqueItems: true, required: true, maxLength: 50 })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiModelProperty({ type: 'string', required: true, maxLength: 255 })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiModelProperty({ type: 'string', required: true, maxLength: 128 })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(128)
  endpointUrl: string;

  @ApiModelProperty({ enum: ['GET', 'POST', 'PUT', 'DELETE'], required: true, maxLength: 6 })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(6)
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
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
