import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mst_majors')
export default class Major {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}
