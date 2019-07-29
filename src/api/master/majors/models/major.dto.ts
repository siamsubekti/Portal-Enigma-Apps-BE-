import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IApiResponse } from '../../../../libraries/responses/response.interface';
import Major from './major.entity';

export class MajorDTO {
    @ApiModelProperty()
    @IsNotEmpty()
    name: string;
}

export class MajorResponseDTO {
    @ApiModelProperty()
    name: string;
}

export class MajorResponse implements IApiResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: MajorDTO;
}

export class MajorsPagedResponse {
    @ApiModelProperty()
    status?: ResponseStatus;
    @ApiModelProperty()
    data: Major[] | Major;
    @ApiModelProperty()
    paging?: PagingData;
}

export class MajorsQueryDTO {
    term?: string;
    order?: 'name';
    sort?: 'asc' | 'desc';
    page?: number;
    rowsPerPage?: number;
}

export class MajorsQueryResult {
    result: Major[] | Major;
    totalRows: number;
}
