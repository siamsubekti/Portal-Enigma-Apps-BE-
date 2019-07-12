import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export default class AcademyDTO {
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

    @ApiModelProperty()
    createdAt: Date;
}
