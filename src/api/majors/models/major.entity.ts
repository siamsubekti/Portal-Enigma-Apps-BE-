import { PrimaryColumn, Generated, Column, Entity } from 'typeorm';

@Entity('mst_majors')
export default class Major {
    @PrimaryColumn({ type: 'int', unsigned: true})
    @Generated()
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}
