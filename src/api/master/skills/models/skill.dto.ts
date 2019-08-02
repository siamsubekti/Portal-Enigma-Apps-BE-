import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IsDefined, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import Skill from './skill.entity';

export class SkillDTO {

    @ApiModelProperty({ type: 'string', maxLength: 255, required: true, uniqueItems: true })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiModelProperty({ type: 'string', required: false })
    @IsOptional()
    @IsDefined()
    description: string;
}

export class SkillResponse implements IApiResponse {
    @ApiModelProperty({ type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ type: SkillDTO })
    data: SkillDTO;
}

export class SkillPageResponse implements IApiPagedResponse {
    @ApiModelProperty({ type: PagingData })
    paging: PagingData;

    @ApiModelProperty({ type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ type: SkillDTO })
    data: SkillDTO[];
}

export class SkillQueryDTO {
    term?: string;
    order?: 'name';
    sort?: 'asc' | 'desc';
    page?: number;
    rowsPerPage?: number;
}

export class SkillQueryResult {
    result: Skill[] | Skill;
    totalRows: number;
}

export class SkillResponses {
    status?: ResponseStatus;
    data: Skill | Skill[];
    paging?: PagingData;
}
