import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TypeAcademy } from '../../../../config/constants';

@Entity('mst_academies')
export default class Academy {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 8, unique: true, nullable: false})
    code: string;

    @Column({ type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({ type: 'varchar', length: 15, nullable: true, default: null })
    phone: string;

    @Column({ type: 'text', nullable: true, default: null})
    address: string;

    @Column({ type: 'varchar', length: 20, nullable: false})
    type: TypeAcademy;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}
