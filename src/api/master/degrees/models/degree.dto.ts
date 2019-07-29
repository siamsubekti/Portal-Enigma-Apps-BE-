import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IsNotEmpty } from 'class-validator';
import Degree from './degree.entity';

export class DegreeDTO {
    @ApiModelProperty()
    @IsNotEmpty()
    name: string;
}

export class DegreeResponseDTO {
    @ApiModelProperty()
    name: string;
}

export class DegreeResponse implements IApiResponse {
    @ApiModelProperty()
    status: ResponseStatus;
    @ApiModelProperty()
    data: DegreeDTO;
}

export class DegreePagedResponse {
    @ApiModelProperty()
    status?: ResponseStatus;
    @ApiModelProperty()
    data: Degree[] | Degree;
    @ApiModelProperty()
    paging?: PagingData;
}

export class DegreesQueryDTO {
    term?: string;
    order?: 'name';
    sort?: 'asc' | 'desc';
    page?: number;
    rowsPerPage?: number;
}

export class DegreesQueryResult {
    result: Degree[] | Degree;
    totalRows: number;
}
