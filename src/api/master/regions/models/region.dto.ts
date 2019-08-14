import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IsDefined, IsEnum, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import Region from './region.entity';
import { RegionType } from 'src/config/constants';

export class RegionDTO {

    @ApiModelProperty({ description: 'Type of a region (VILLAGE, CITY, and more).', enum: RegionType, maxLength: 32, required: true })
    @IsDefined()
    @IsEnum(RegionType)
    @IsNotEmpty()
    @MaxLength(32)
    type: RegionType;

    @ApiModelProperty({ description: 'Name of a region.', type: 'string', uniqueItems: true, maxLength: 255, required: true })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiModelProperty({ description: 'Description about the region.', type: Region, required: false })
    @IsOptional()
    @IsDefined()
    parent?: Region;
}

export class RegionResponse implements IApiResponse {
    @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ description: 'Region data.', type: RegionDTO })
    data: RegionDTO;
}

export class RegionPageResponse implements IApiPagedResponse {

    @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ description: 'List of regions.', type: [ RegionDTO ] })
    data: RegionDTO[];

    @ApiModelProperty({ description: 'Paging data.', type: PagingData })
    paging: PagingData;
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

export class RegionSearchResponse implements IApiResponse {
    @ApiModelProperty({ description: 'Response status.', type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ description: 'Region data.', type: [ RegionDTO ] })
    data: RegionDTO[];
}
