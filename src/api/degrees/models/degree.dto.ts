import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../libraries/responses/response.class';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class DegreeDTO {
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    @IsNotEmpty()
    @MaxLength(25, {message: 'Name Max 25 length'})
    name: string;

    @ApiModelProperty()
    createdAt: Date;
}

export class DegreeResponseDTO {
    @ApiModelProperty()
    id: number;

    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    createdAt: Date;
}

export class DegreeResponse implements IApiResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: DegreeDTO;
}

export class DegreePagedResponse implements IApiPagedResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: DegreeDTO[];
    @ApiModelProperty()
    paging: PagingData;
}
