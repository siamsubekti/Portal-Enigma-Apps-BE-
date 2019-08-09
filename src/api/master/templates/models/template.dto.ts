import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IsDefined, IsNotEmpty, MaxLength, IsOptional, IsEnum } from 'class-validator';
import Template from './template.entity';
import { TemplateType } from 'src/config/constants';

export class TemplateDTO {

    @ApiModelProperty({ description: 'Name of template.', type: 'string', uniqueItems: true, required: true, maxLength: 255 })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiModelProperty({ description: 'Type of template.', enum: TemplateType, required: true, maxLength: 50 })
    @IsDefined()
    @IsNotEmpty()
    @IsEnum(TemplateType)
    @MaxLength(50)
    type: TemplateType;

    @ApiModelProperty({ description: 'Subject of template.', type: 'string', required: false, maxLength: 255 })
    @IsOptional()
    @IsDefined()
    @MaxLength(255)
    subject: string;

    @ApiModelProperty({ description: 'Content body.', type: 'string', required: true })
    @IsDefined()
    @IsNotEmpty()
    body: string;
}

export class TemplateResponse implements IApiResponse {
    @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ description: 'Template data.', type: TemplateDTO })
    data: TemplateDTO;
}

export class TemplatePageResponse implements IApiPagedResponse {

    @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ description: 'List of templates.', type: [ TemplateDTO ] })
    data: TemplateDTO[];

    @ApiModelProperty({ description: 'Paging data.', type: PagingData })
    paging: PagingData;
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
