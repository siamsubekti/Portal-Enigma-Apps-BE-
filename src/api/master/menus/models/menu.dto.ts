import { ApiModelProperty } from '@nestjs/swagger';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import Role from '../../roles/models/role.entity';

export class MenuDTO {
    @ApiModelProperty()
    code: string;
    @ApiModelProperty()
    name: string;
    roles: Role;
}

export class MenuResponseDTO {
    @ApiModelProperty()
    code: string;
    @ApiModelProperty()
    name: string;
    roles: Role;
}

export class MenuResponse implements IApiResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: MenuDTO;
}

export class MenuPagedResponse implements IApiPagedResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: MenuDTO[];
    @ApiModelProperty()
    paging: PagingData;
}
