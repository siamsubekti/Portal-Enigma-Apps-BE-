import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from 'src/libraries/response/response.interface';
import { ResponseStatus, PagingData } from 'src/libraries/response/response.class';

export class RegionDTO {

    id?: string;

    @ApiModelProperty()
    type: string;

    @ApiModelProperty()
    name: string;

    createdAt: Date;
}

export class RegionResponse implements IApiResponse {
    status: ResponseStatus;
    data: RegionDTO;
}

export class RegionPageResponse implements IApiPagedResponse {
    paging: PagingData;
    status: ResponseStatus;
    data: RegionDTO[];
}