import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDefined, MaxLength, IsOptional } from 'class-validator';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import Job from './job.entity';

export class JobDTO {

    @ApiModelProperty({ description: 'Name of job.', type: 'string', uniqueItems: true, required: true, maxLength: 255 })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiModelProperty({ description: 'Descriptions about the job.', type: 'string', required: false })
    @IsOptional()
    @IsDefined()
    description: string;
}

export class JobResponse implements IApiResponse {
    @ApiModelProperty({ description: 'Response Status.', type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ description: 'Job data.', type: JobDTO })
    data: JobDTO;
}

export class JobPageResponse implements IApiPagedResponse {

    @ApiModelProperty({ description: 'Response Status.', type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ description: 'List of jobs.', type: [ JobDTO ] })
    data: JobDTO[];

    @ApiModelProperty({ description: 'Paging data.', type: PagingData })
    paging: PagingData;
}

export class JobQueryDTO {
    term?: string;
    order?: 'name';
    sort?: 'asc' | 'desc';
    page?: number;
    rowsPerPage?: number;
}

export class JobQueryResult {
    result: Job[] | Job;
    totalRows: number;
}

export class JobResponses {
    status?: ResponseStatus;
    data: Job | Job[];
    paging?: PagingData;
}

export class JobSearchResponse implements IApiResponse {
    @ApiModelProperty({ description: 'Response Status.', type: ResponseStatus })
    status: ResponseStatus;

    @ApiModelProperty({ description: 'Job data.', type: [ JobDTO ] })
    data: JobDTO[];
}
