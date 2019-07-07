import { ApiModelProperty } from '@nestjs/swagger';

export class ResponseStatus {
  @ApiModelProperty()
  code: string;
  @ApiModelProperty()
  description: string;
}

export class PagingData {
  @ApiModelProperty()
  page: number;
  @ApiModelProperty()
  totalPages: number;
  @ApiModelProperty()
  totalRows: number;
  @ApiModelProperty()
  rowsPerPage: number;
}
