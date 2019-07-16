import { Entity, PrimaryColumn, Generated, Column } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

@Entity('mst_academies')
export default class Academy {
    @ApiModelProperty()
    @PrimaryColumn({ type: 'int', unsigned: true})
    @Generated()
    id: number;

    @ApiModelProperty()
    @Column({ type: 'varchar', length: 8, unique: true, nullable: false})
    code: string;

    @ApiModelProperty()
    @Column({ type: 'varchar', length: 255, nullable: false})
    name: string;

    @ApiModelPropertyOptional()
    @Column({ type: 'varchar', length: 15, nullable: true, default: null })
    phone: string;

    @ApiModelPropertyOptional()
    @Column({ type: 'text', nullable: true, default: null})
    address: string;

    @ApiModelProperty()
    @Column({ type: 'varchar', length: 20, nullable: false})
    type: string;

    @ApiModelProperty()
    @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}
