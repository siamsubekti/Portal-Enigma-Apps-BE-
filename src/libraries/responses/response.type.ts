import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from './response.interface';
import { ResponseStatus, PagingData } from './response.class';

export class ApiResponse implements IApiResponse {
  @ApiModelProperty({type: ResponseStatus})
  status: ResponseStatus;

  @ApiModelProperty()
  data: any;
}

export class ApiExceptionResponse {
  @ApiModelProperty({type: ResponseStatus})
  status: ResponseStatus;
}

export class ApiPagedResponse implements IApiPagedResponse {
  @ApiModelProperty()
  status: ResponseStatus;

  @ApiModelProperty({type: []})
  data: any[];

  @ApiModelProperty()
  paging: PagingData;
}
