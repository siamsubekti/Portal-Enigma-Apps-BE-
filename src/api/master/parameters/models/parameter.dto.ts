import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IsDefined, IsNotEmpty, MaxLength } from 'class-validator';
import Parameter from './parameter.entity';

export default class ParameterDTO {

  @ApiModelProperty({ description: 'Key of a parameter.', type: 'string', uniqueItems: true, maxLength: 255, required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  key: string;

  @ApiModelProperty({ description: 'Value of a parameter.', type: 'string', maxLength: 255, required: true })
  @IsDefined()
  @IsNotEmpty()
  @MaxLength(255)
  value: string;
}

export class ParameterResponse implements IApiResponse {
  @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
  status: ResponseStatus;

  @ApiModelProperty({ description: 'Parameter data.', type: ParameterDTO })
  data: ParameterDTO;
}

export class ParameterPageResponse implements IApiPagedResponse {

  @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
  status: ResponseStatus;

  @ApiModelProperty({ description: 'List of Parameters.', type: [ ParameterDTO ] })
  data: ParameterDTO[];

  @ApiModelProperty({ description: 'Paging data.', type: PagingData })
  paging: PagingData;
}

export class ParameterQueryDTO {
  term?: string;
  order?: 'key' | 'value';
  sort?: 'asc' | 'desc';
  page?: number;
  rowsPerPage?: number;
}

export class ParameterQueryResult {
  result: Parameter[] | Parameter;
  totalRows: number;
}

export class ParameterResponses {
  status?: ResponseStatus;
  data: Parameter | Parameter[];
  paging?: PagingData;
}
