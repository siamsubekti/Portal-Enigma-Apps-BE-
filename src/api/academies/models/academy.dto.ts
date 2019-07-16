import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsDefined, IsEnum } from 'class-validator';
import { IApiResponse, IApiPagedResponse } from '../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../libraries/responses/response.class';

export class AcademyDTO {
    @ApiModelProperty()
    id?: number;

    @ApiModelProperty()
    @IsNotEmpty()
    code: string;

    @ApiModelProperty()
    @IsNotEmpty()
    name: string;

    @ApiModelPropertyOptional()
    @MaxLength(13, {message: 'Phone max 13 length'})
    phone?: string;

    @ApiModelPropertyOptional()
    address?: string;

    @ApiModelProperty({enum: [ 'SMA', 'SMK', 'D3', 'S1', 'S2']})
    @IsEnum([ 'SMA', 'SMK', 'D3', 'S1', 'S2'])
    @IsDefined()
    @IsNotEmpty()
    type: string;

    @ApiModelProperty()
    createdAt: Date;
}

export class AcademyResponseDTO {
    @ApiModelProperty()
    id?: number;

    @ApiModelProperty()
    code: string;

    @ApiModelProperty()
    @IsNotEmpty()
    name: string;

    @ApiModelPropertyOptional()
    phone?: string;

    @ApiModelPropertyOptional()
    address?: string;

    @ApiModelProperty({enum: [ 'SMA', 'SMK', 'D3', 'S1', 'S2']})
    @IsEnum([ 'SMA', 'SMK', 'D3', 'S1', 'S2'])
    type: string;

    @ApiModelProperty()
    createdAt: Date;
}

export class AcademyResponse implements IApiResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: AcademyDTO;
}

export class AcademiesPagedResponse implements IApiPagedResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: AcademyDTO[];
    @ApiModelProperty()
    paging: PagingData;
}
