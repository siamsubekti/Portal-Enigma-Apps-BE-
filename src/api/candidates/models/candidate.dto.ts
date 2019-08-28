import { ApiModelProperty } from '@nestjs/swagger';
import { ResponseStatus } from '../../../libraries/responses/response.class';

export class CandidateDocumentResponse {
  @ApiModelProperty({type: ResponseStatus, description: 'Response status.'})
  status: ResponseStatus;

  @ApiModelProperty({type: ['string'], description: 'Documents download path.'})
  data: string[];
}
