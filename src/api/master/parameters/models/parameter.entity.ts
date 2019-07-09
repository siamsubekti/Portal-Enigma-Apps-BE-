import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mst_parameters')
export default class Parameter {

    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    key: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    value: string;

    @Column({name: 'created_at', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}