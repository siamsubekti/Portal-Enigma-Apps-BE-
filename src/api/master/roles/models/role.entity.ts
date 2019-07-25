import { PrimaryColumn, Generated, Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import Service from '../../services/models/service.entity';

@Entity('mst_roles')
export default class Role {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 25, nullable: false, unique: true })
    code: string;

    @Column({ type: 'varchar', length: 25, nullable: false })
    name: string;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToMany(() => Service, services => services.roles)
    services: Service[];
}
