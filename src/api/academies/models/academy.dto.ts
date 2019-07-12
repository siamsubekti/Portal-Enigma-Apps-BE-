import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IApiResponse, IApiPagedResponse } from 'src/libraries/responses/response.interface';
import { ResponseStatus, PagingData } from 'src/libraries/responses/response.class';

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
    @MaxLength(15, {message: 'Length maximal 15 number'})
    @MinLength(10, {message: 'Length minimal 10 number'})
    phone?: string;

    @ApiModelPropertyOptional()
    address?: string;

    @ApiModelProperty()
    @IsNotEmpty()
    type: string;

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

    @ApiModelProperty()
    @IsNotEmpty()
    type: string;
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
