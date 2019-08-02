import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IsDefined, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import Template from './template.entity';

export class TemplateDTO {

    @ApiModelProperty({ type: 'string', uniqueItems: true, required: true, maxLength: 255 })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiModelProperty({ type: 'string', required: true, maxLength: 50 })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(50)
    type: string;

    @ApiModelProperty({ type: 'string', required: false, maxLength: 255 })
    @IsOptional()
    @IsDefined()
    @MaxLength(255)
    subject: string;

    @ApiModelProperty({ type: 'string', required: true })
    @IsDefined()
    @IsNotEmpty()
    body: string;
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

export class TemplateQueryDTO {
    term?: string;
    order?: 'type' | 'name';
    sort?: 'asc' | 'desc';
    page?: number;
    rowsPerPage?: number;
}

export class TemplateQueryResult {
    result: Template[] | Template;
    totalRows: number;
}

export class TemplateResponses {
    status?: ResponseStatus;
    data: Template | Template[];
    paging?: PagingData;
}
