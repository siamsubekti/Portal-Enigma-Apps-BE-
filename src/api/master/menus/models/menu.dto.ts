import { ApiModelProperty } from '@nestjs/swagger';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import Menu from './menu.entity';

export class MenuDTO {
    @ApiModelProperty()
    code: string;

    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    order: number;

    @ApiModelProperty()
    icon: string;

    @ApiModelProperty()
    parentId?: number;

    @ApiModelProperty()
    parentMenu?: Menu;
}

export class MenuResponseDTO {
    @ApiModelProperty()
    code: string;
    @ApiModelProperty()
    name: string;
    @ApiModelProperty()
    order: number;
    @ApiModelProperty()
    icon: string;
    @ApiModelProperty()
    menus: Menu[];
}

export class MenuResponse {
    @ApiModelProperty()
    status?: ResponseStatus;
    @ApiModelProperty()
    data: Menu | Menu[];
    @ApiModelProperty()
    PagingData?: PagingData;
}

export class MenuPagedResponse {
    @ApiModelProperty()
    status?: ResponseStatus;
    @ApiModelProperty()
    data: Menu[] | Menu;
    @ApiModelProperty()
    paging?: PagingData;
}

export class MenuQueryDTO {
    term?: string;
    order?: 'code' | 'name' | 'order' | 'icon';
    sort?: 'asc' | 'desc';
    page?: number;
    rowsPerPage?: number;
  }

export class MenuQueryResult {
    result: Menu[] | Menu;
    totalRows: number;
  }
