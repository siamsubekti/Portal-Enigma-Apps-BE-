import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IsDefined, IsEnum, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import Region from './region.entity';
import { RegionType } from 'src/config/constants';

export class RegionDTO {

    @ApiModelProperty({ enum: RegionType, maxLength: 32, required: true })
    @IsDefined()
    @IsEnum(RegionType)
    @IsNotEmpty()
    @MaxLength(32)
    type: RegionType;

    @ApiModelProperty({ type: 'string', uniqueItems: true, maxLength: 255, required: true })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiModelProperty({ type: Region, required: false })
    @IsOptional()
    @IsDefined()
    parent?: Region;
}

export class RegionResponse implements IApiResponse {
    @ApiModelProperty({ type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ type: RegionDTO })
    data: RegionDTO;
}

export class RegionPageResponse implements IApiPagedResponse {
    @ApiModelProperty({ type: PagingData })
    paging: PagingData;

    @ApiModelProperty({ type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ type: RegionDTO })
    data: RegionDTO[];
}

export class RegionQueryDTO {
    term?: string;
    order?: 'type' | 'name';
    sort?: 'asc' | 'desc' = 'asc';
    page?: number;
    rowsPerPage?: number;
}

export class RegionQueryResult {
    result: Region[] | Region;
    totalRows: number;
}

export class RegionResponses {
    status?: ResponseStatus;
    data: Region | Region[];
    paging?: PagingData;
}
