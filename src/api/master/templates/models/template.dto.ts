import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from 'src/libraries/response/response.interface';
import { ResponseStatus, PagingData } from 'src/libraries/response/response.class';

export class TemplateDTO {

    id?: number;

    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    type: string;

    @ApiModelProperty()
    subject: string;

    @ApiModelProperty()
    body: string;

    createdAt: Date;
}

export class TemplateResponse implements IApiResponse {
    status: ResponseStatus;
    data: TemplateDTO;
}

export class TemplatePageResponse implements IApiPagedResponse {
    paging: PagingData;
    status: ResponseStatus;
    data: TemplateDTO[];
} 