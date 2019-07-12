import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../libraries/responses/response.class';

export class DegreeDTO {
    @ApiModelProperty()
    name: string;
}

export class DegreeResponseDTO {
    @ApiModelProperty()
    name: string;
}

export class MajorResponse implements IApiResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: DegreeDTO;
}

export class MajorPagedResponse implements IApiPagedResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: DegreeDTO[];
    @ApiModelProperty()
    paging: PagingData;
}
