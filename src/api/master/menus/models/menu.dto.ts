import { ApiModelProperty } from '@nestjs/swagger';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import Menu from './menu.entity';
import { IsDefined, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class MenuDTO {
    @ApiModelProperty({description: 'Menu code', type: 'string', required: true})
    @IsDefined()
    @IsNotEmpty()
    code: string;

    @ApiModelProperty({description: 'Menu name', type: 'string', required: true})
    @IsDefined()
    @IsNotEmpty()
    name: string;

    @ApiModelProperty({description: 'Menu order', type: 'number', required: true})
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    order: number;

    @ApiModelProperty({description: 'Menu icon', type: 'string', required: true})
    @IsDefined()
    @IsNotEmpty()
    icon?: string;

    @ApiModelProperty({description: 'Menu path', type: 'string', required: true})
    @IsDefined()
    @IsNotEmpty()
    path: string;

    @ApiModelProperty({description: 'Menu parent', type: 'string', required: false})
    @IsOptional()
    @IsDefined()
    @IsNotEmpty()
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
