import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('mst_regions')
export default class Region {

    @PrimaryColumn({type: 'varchar', length: 64, nullable: false})
    id: string;    

    @Column({type: 'varchar', length: 32, nullable: false})
    type: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({name: 'created_at', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}