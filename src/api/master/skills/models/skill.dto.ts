import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IsDefined, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import Skill from './skill.entity';

export class SkillDTO {

    @ApiModelProperty({ description: 'Name of skill.', type: 'string', maxLength: 255, required: true, uniqueItems: true })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiModelProperty({ description: 'Description about the skill.', type: 'string', required: false })
    @IsOptional()
    @IsDefined()
    description: string;
}

export class SkillResponse implements IApiResponse {
    @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ description: 'Skill data.', type: SkillDTO })
    data: SkillDTO;
}

export class SkillPageResponse implements IApiPagedResponse {

    @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ description: 'List of skills.', type: [ SkillDTO ] })
    data: SkillDTO[];

    @ApiModelProperty({ description: 'Paging data.', type: PagingData })
    paging: PagingData;
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

export class SkillSearchResponse implements IApiResponse {
    @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ description: 'Skill data.', type: [ SkillDTO ] })
    data: SkillDTO[];
}
