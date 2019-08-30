import * as moment from 'moment';
import { ApiModelProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../libraries/responses/response.class';

export class CandidateDocumentResponse {
  @ApiModelProperty({type: ResponseStatus, description: 'Response status.'})
  status: ResponseStatus;

  @ApiModelProperty({type: ['string'], description: 'Documents download path.'})
  data: string[];
}

export class CandidateQueryDTO {
  term?: string;
  startDate?: moment.Moment;
  endDate?: moment.Moment;
  order?: 'fullname' | 'email' | 'birthdate' | 'age';
  sort?: 'asc' | 'desc';
  page?: number;
  rowsPerPage?: number;
}
