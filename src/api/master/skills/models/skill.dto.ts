import { ApiModelProperty } from "@nestjs/swagger";

export class SkillDTO {

    @ApiModelProperty()
    readonly name: string;

    @ApiModelProperty()
    readonly description: string;
}