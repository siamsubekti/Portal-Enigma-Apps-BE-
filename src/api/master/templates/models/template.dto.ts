import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';

export class TemplateDTO {

    id?: number;

    @ApiModelProperty({ uniqueItems: true })
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
    @ApiModelProperty({ type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ type: TemplateDTO })
    data: TemplateDTO;
}

export class TemplatePageResponse implements IApiPagedResponse {
    @ApiModelProperty({ type: PagingData })
    paging: PagingData;

    @ApiModelProperty({ type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ type: TemplateDTO })
    data: TemplateDTO[];
}
