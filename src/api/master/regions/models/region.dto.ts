import { ApiModelProperty } from "@nestjs/swagger";

export class RegionDTO {

    @ApiModelProperty()
    readonly type : string;

    @ApiModelProperty()
    readonly name : string;
}