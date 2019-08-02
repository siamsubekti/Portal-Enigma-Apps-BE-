import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsDefined, IsEnum } from 'class-validator';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import Academy from './academy.entity';
import { TypeAcademy } from '../../../../config/constants';

export class AcademyDTO {
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

    @ApiModelProperty({ enum: TypeAcademy, required: true, maxLength: 5 })
    @IsDefined()
    @IsNotEmpty()
    @IsEnum(TypeAcademy)
    @MaxLength(5)
    type: TypeAcademy;
}

export class AcademyResponseDTO {
    @ApiModelProperty()
    code: string;

    @ApiModelProperty()
    @IsNotEmpty()
    name: string;

    @ApiModelPropertyOptional()
    phone?: string;

    @ApiModelPropertyOptional()
    address?: string;

    @ApiModelProperty()
    type: TypeAcademy;
}

export class AcademyResponse {
    @ApiModelProperty()
    status?: ResponseStatus;
    @ApiModelProperty()
    data: Academy | Academy[];
    @ApiModelProperty()
    paging?: PagingData;
}

export class AcademiesPagedResponse {
    @ApiModelProperty()
    status?: ResponseStatus;
    @ApiModelProperty()
    data: Academy | Academy[];
    @ApiModelProperty()
    paging?: PagingData;
}

export class AcademiesQueryDTO {
    term?: string;
    order?: 'code' | 'name' | 'phone' | 'type';
    sort?: 'asc' | 'desc';
    page?: number;
    rowsPerPage?: number;
}

export class AcademiesQueryResult {
    result: Academy[] | Academy;
    totalRows: number;
}
