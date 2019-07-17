import { ApiModelProperty } from '@nestjs/swagger';
import { ResponseStatus, PagingData } from 'src/libraries/responses/response.class';
import { IApiResponse, IApiPagedResponse } from 'src/libraries/responses/response.interface';

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
