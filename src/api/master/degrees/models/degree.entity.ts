import { PrimaryColumn, Generated, Column, Entity } from 'typeorm';

@Entity('mst_degrees')
export default class Degree {
    @PrimaryColumn({ type: 'int', unsigned: true})
    @Generated()
    id: number;

    @Column({ type: 'varchar', length: 10, nullable: false})
    name: string;

    @Column({ type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}
