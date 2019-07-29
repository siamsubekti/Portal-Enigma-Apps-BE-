import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mst_degrees')
export default class Degree {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 10, nullable: false})
    name: string;

    @Column({ type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}
