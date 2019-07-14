import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../libraries/responses/response.class';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class DegreeDTO {
    @ApiModelProperty()
    @IsNotEmpty()
    @MaxLength(5, {message: 'Max name 5 length'})
    name: string;
}

export class DegreeResponseDTO {
    @ApiModelProperty()
    name: string;
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
