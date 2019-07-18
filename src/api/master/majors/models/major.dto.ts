import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ResponseStatus, PagingData } from 'src/libraries/responses/response.class';
import { IApiPagedResponse, IApiResponse } from 'src/libraries/responses/response.interface';

export class MajorDTO {
    @ApiModelProperty()
    @IsNotEmpty()
    name: string;
}

export class MajorResponseDTO {
    @ApiModelProperty()
    name: string;
}

export class MajorResponse implements IApiResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: MajorDTO;
}

export class MajorPagedResponse implements IApiPagedResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: MajorDTO[];
    @ApiModelProperty()
    paging: PagingData;
}
