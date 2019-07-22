import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';

export default class ParameterDTO {
    id?: number;

    @ApiModelProperty({ uniqueItems: true })
    key: string;

    @ApiModelProperty()
    value: string;

    createdAt: Date;
}

export class ParameterResponse implements IApiResponse {
    @ApiModelProperty({ type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ type: ParameterDTO })
    data: ParameterDTO;
}

export class ParameterPageResponse implements IApiPagedResponse {

    @ApiModelProperty({ type: PagingData })
    paging: PagingData;

    @ApiModelProperty({ type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ type: ParameterDTO })
    data: ParameterDTO[];
}
