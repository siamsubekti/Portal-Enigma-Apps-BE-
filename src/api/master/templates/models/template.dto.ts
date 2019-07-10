import { ApiModelProperty } from '@nestjs/swagger';

export class TemplateDTO {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly type: string;

    @ApiModelProperty()
    readonly subject: string;

    @ApiModelProperty()
    readonly body: string;
}