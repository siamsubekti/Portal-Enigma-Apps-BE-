import { ApiModelProperty } from "@nestjs/swagger";
import { ResponseStatus, PagingData } from "src/libraries/response/response.class";
import { IApiResponse, IApiPagedResponse } from "src/libraries/response/response.interface";

export class SkillDTO {

    id?: number;

    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    description: string;

    createdAt: Date;
}

export class SkillResponse implements IApiResponse {
    status: ResponseStatus;
    data: SkillDTO;
}

export class SkillPageResponse implements IApiPagedResponse {
    paging: PagingData;
    status: ResponseStatus;
    data: SkillDTO[];
} 