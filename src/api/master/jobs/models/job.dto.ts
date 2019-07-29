import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';

export class JobDTO {

    id?: number;

    @ApiModelProperty()
    @IsNotEmpty()
    name: string;

    @ApiModelProperty()
    description: string;

    createdAt: Date;
}

export class JobResponse implements IApiResponse {
    @ApiModelProperty({ type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ type: JobDTO })
    data: JobDTO;
}

export class JobPageResponse implements IApiPagedResponse {
    @ApiModelProperty({ type: PagingData })
    paging: PagingData;

    @ApiModelProperty({ type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ type: JobDTO })
    data: JobDTO[];
}
