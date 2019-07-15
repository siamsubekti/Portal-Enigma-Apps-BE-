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

    @ApiModelProperty({enum: [ 'SD', 'SMP', 'SMA/SMK', 'PERGURUAN TINGGI']})
    @IsEnum([ 'SD', 'SMP', 'SMA/SMK', 'PERGURUAN TINGGI'])
    @IsDefined()
    @IsNotEmpty()
    type: 'SD' | 'SMP' | 'SMA/SMK' | 'PERGURUAN TINGGI';

    @ApiModelProperty()
    createdAt: Date;
}

export class AcademyResponseDTO {
    @ApiModelProperty()
    id?: number;

    @ApiModelProperty()
    @IsNotEmpty({message: 'Harus diisi'})
    code: string;

    @ApiModelProperty()
    @IsNotEmpty()
    name: string;

    @ApiModelPropertyOptional()
    phone?: string;

    @ApiModelPropertyOptional()
    address?: string;

    @ApiModelProperty({enum: [ 'SD', 'SMP', 'SMA/SMK', 'PERGURUAN TINGGI']})
    @IsEnum([ 'SD', 'SMP', 'SMA/SMK', 'PERGURUAN TINGGI'])
    @IsDefined()
    @IsNotEmpty()
    type: 'SD' | 'SMP' | 'SMA/SMK' | 'PERGURUAN TINGGI';

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
