import { ApiModelProperty } from '@nestjs/swagger';

export class ResponseStatus {
  @ApiModelProperty({ description: 'HTTP status code.', type: 'string' })
  code: string;
  @ApiModelProperty({ description: 'HTTP status description/message.', type: 'string' })
  description: string;
}

export class PagingData {
  @ApiModelProperty({ description: 'Current page number.', type: 'number' })
  page: number;
  @ApiModelProperty({ description: 'The total of all pages.', type: 'number' })
  totalPages: number;
  @ApiModelProperty({ description: 'The total of all rows.', type: 'number' })
  totalRows: number;
  @ApiModelProperty({ description: 'Rows displayed per page.', type: 'number' })
  rowsPerPage: number;
}
