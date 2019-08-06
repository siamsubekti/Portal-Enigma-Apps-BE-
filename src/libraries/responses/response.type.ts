import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from './response.interface';
import { ResponseStatus, PagingData } from './response.class';

export class ApiResponse implements IApiResponse {
  @ApiModelProperty({ type: ResponseStatus })
  status: ResponseStatus;

  @ApiModelProperty()
  data: any;
}

export class ApiExceptionResponse {
  @ApiModelProperty({ type: ResponseStatus })
  status: ResponseStatus;
}

export class ApiPagedResponse implements IApiPagedResponse {
  @ApiModelProperty({ type: ResponseStatus })
  status: ResponseStatus;

  @ApiModelProperty({ type: Array })
  data: any[];

  @ApiModelProperty({ type: PagingData, required: false })
  paging?: PagingData;
}
