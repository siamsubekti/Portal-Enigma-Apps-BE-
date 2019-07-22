import { ApiModelProperty } from '@nestjs/swagger';
import { IApiResponse, IApiPagedResponse } from '../../../../libraries/responses/response.interface';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';
import { IsDefined, IsEnum } from 'class-validator';

export class RegionDTO {

    id?: string;

    @IsDefined()
    @IsEnum(['KELURAHAN', 'KECAMATAN', 'KABUPATEN', 'KOTA', 'PROVINSI'])
    @ApiModelProperty({ enum: ['KELURAHAN', 'KECAMATAN', 'KABUPATEN', 'KOTA', 'PROVINSI'] })
    type: 'KELURAHAN' | 'KECAMATAN' | 'KABUPATEN' | 'KOTA' | 'PROVINSI';

    @ApiModelProperty({ uniqueItems: true })
    name: string;

    createdAt: Date;
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
