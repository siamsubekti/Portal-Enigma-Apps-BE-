import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IApiResponse, IApiPagedResponse } from 'src/libraries/response/response.interface';
import { ResponseStatus, PagingData } from 'src/libraries/response/response.class';

export class JobDTO{

    id?: number;

    @ApiModelProperty()
    @IsNotEmpty()
    name: string;

    @ApiModelProperty()
    description: string;

    createdAt: Date;
}

export class JobResponse implements IApiResponse {
    status: ResponseStatus;
    data: JobDTO;
}

export class JobPageResponse implements IApiPagedResponse {
    paging: PagingData;
    status: ResponseStatus;
    data: JobDTO[];
}