import { ResponseStatus, PagingData } from '../../../libraries/responses/response.class';
import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class ContactFormDTO {
  @ApiModelProperty({ type: 'string', required: true })
  @IsDefined()
  @IsNotEmpty()
  fullname: string;

  @ApiModelProperty({ type: 'string', required: true })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiModelProperty({ type: 'string', required: true })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(5)
  subject: string;

  @ApiModelProperty({ type: 'string', required: true })
  @IsDefined()
  @IsNotEmpty()
  @MinLength(20)
  content: string;
}

export class MessageDTO {
  @ApiModelProperty({ type: 'string', required: true })
  id: string;

  @ApiModelProperty({ type: 'string', required: true })
  fullname: string;

  @ApiModelProperty({ type: 'string', required: true })
  email: string;

  @ApiModelProperty({ type: 'string', required: true })
  subject: string;

  @ApiModelProperty({ type: 'string', required: true })
  content: string;

  @ApiModelProperty({ type: 'string', required: true })
  createdAt: Date;

  @ApiModelProperty({ type: 'string', required: true })
  updatedAt: Date;

  @ApiModelProperty({ type: 'string', required: true })
  readAt: Date;
}

export class MessageQueryParams {
  read?: boolean;
  term?: string;
  page?: number;
  rowsPerPage?: number;
  order?: 'email' | 'fullname' | 'subject' | 'createdAt' | 'readAt';
  sort?: 'asc' | 'desc';
}

export class MessageResponse {
  @ApiModelProperty({ type: ResponseStatus, description: 'Response status'})
  status?: ResponseStatus;

  @ApiModelProperty({ type: MessageDTO, description: 'Response status'})
  data: MessageDTO;
}

export class MessagePagedResponse {
  @ApiModelProperty({ type: ResponseStatus, description: 'Response status'})
  status?: ResponseStatus;

  @ApiModelProperty({ type: MessageDTO, description: 'Response status'})
  data: MessageDTO[];

  @ApiModelProperty({ type: PagingData, description: 'Response status'})
  paging: PagingData;
}
