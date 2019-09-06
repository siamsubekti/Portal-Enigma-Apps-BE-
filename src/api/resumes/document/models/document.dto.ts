import { ApiModelProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';
import { ResponseStatus, PagingData } from '../../../../libraries/responses/response.class';

export class DocumentDTO {

    @ApiModelProperty({ description: 'Document name.', type: 'string', required: true, maxLength: 255 })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(255)
    name: string;

    @ApiModelProperty({ description: 'Document type.', type: 'string', required: true, maxLength: 5 })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(5)
    type: string;

    @ApiModelProperty({ description: 'Document size.', type: 'number', required: true })
    @IsDefined()
    @IsNotEmpty()
    @IsNumber()
    size: number;

    @ApiModelProperty({ description: 'Document filepath.', type: 'string', required: true, maxLength: 255 })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(255)
    filepath: string;

    @ApiModelProperty({ description: 'Document has account_id', type: 'string', required: true, maxLength: 64 })
    @IsDefined()
    @IsNotEmpty()
    @MaxLength(64)
    accountId: string;
}

export class DocumentResponse {

    @ApiModelProperty({ description: 'Response status.', type: ResponseStatus, required: false })
    status?: ResponseStatus;

    @ApiModelProperty({description: 'Document data.', type: DocumentDTO, required: true })
    data: DocumentDTO;
}

export class DocumentPageResponse {

    @ApiModelProperty({ description: 'Response status.', type: ResponseStatus, required: false })
    status?: ResponseStatus;

    @ApiModelProperty({description: 'List of documents.', type: [ DocumentDTO ], required: true })
    data: DocumentDTO[];

    @ApiModelProperty({ description: 'Paging data.', type: PagingData, required: true })
    paging: PagingData;
}
