import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class JobDTO{

    @ApiModelProperty()
    @IsNotEmpty()
    readonly name: string;

    @ApiModelProperty()
    readonly description: string;
}