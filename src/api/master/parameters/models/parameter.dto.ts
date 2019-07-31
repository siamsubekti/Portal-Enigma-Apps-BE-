import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IsDefined, IsNotEmpty, MaxLength } from 'class-validator';

export default class ParameterDTO {

    @ApiModelProperty({ type: 'string', uniqueItems: true, maxLength: 255, required: true })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(255)
    key: string;

    @ApiModelProperty({ type: 'string', maxLength: 255, required: true })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(255)
    value: string;
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
