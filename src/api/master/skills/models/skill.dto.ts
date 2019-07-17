import { ApiModelProperty } from '@nestjs/swagger';
import { ResponseStatus, PagingData } from 'src/libraries/responses/response.class';
import { IApiResponse, IApiPagedResponse } from 'src/libraries/responses/response.interface';

export class SkillDTO {

    id?: number;

    @ApiModelProperty({ uniqueItems: true })
    name: string;

    @ApiModelProperty()
    description: string;

    createdAt: Date;
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
