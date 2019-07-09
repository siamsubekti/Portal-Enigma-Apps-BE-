import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mst_jobs')
export default class Job {

    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @Column({name: 'created_at', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}