import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import Service from './service.entity';
import { IsNotEmpty, IsDefined, MaxLength, IsEnum, IsOptional } from 'class-validator';
import { HttpMethod, ServiceType } from '../../../../config/constants';

export class ServiceDTO {
  @ApiModelProperty({ description: 'ID of a service.', type: 'number', required: false })
  id?: number;

  @ApiModelProperty({ description: 'Code of a service.', type: 'string', uniqueItems: true, required: true, maxLength: 50 })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiModelProperty({ description: 'Name of a service.', type: 'string', required: true, maxLength: 255 })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiModelProperty({ description: 'End point URL of a service.', type: 'string', required: true, maxLength: 128 })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(128)
  endpointUrl: string;

  @ApiModelProperty({ description: 'HTTP method of a service.', enum: HttpMethod, required: true, maxLength: 6 })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(HttpMethod)
  @MaxLength(6)
  method: HttpMethod;

  @ApiModelProperty({ description: 'Service type of a service.', enum: ServiceType, required: true, maxLength: 11 })
  @IsOptional()
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(ServiceType)
  @MaxLength(11)
  serviceType?: ServiceType;
}

export class ServiceResponse implements IApiResponse {
  @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
  status: ResponseStatus;

  @ApiModelProperty({ description: 'Service data.', type: ServiceDTO })
  data: ServiceDTO;
}

export class ServicePageResponse implements IApiPagedResponse {

  @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
  status: ResponseStatus;

  @ApiModelProperty({ description: 'List of services.', type: [ ServiceDTO ] })
  data: ServiceDTO[];

  @ApiModelProperty({ description: 'Paging data.', type: PagingData })
  paging: PagingData;

}

export class ServiceQueryDTO {
  term?: string;
  order?: 'code' | 'name';
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

export class ServiceSearchResponse implements IApiResponse {
  @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
  status: ResponseStatus;

  @ApiModelProperty({ description: 'Service data.', type: [ ServiceDTO ] })
  data: ServiceDTO[];
}
