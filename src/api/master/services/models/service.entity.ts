import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import Role from '../../roles/models/role.entity';

@Entity({ name: 'mst_services' })
export default class Service {

    @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    code: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ name: 'endpoint_url', type: 'varchar', length: 128, nullable: false })
    endpointUrl: string;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToMany(() => Role, roles => roles.services, { eager: true })
    @JoinTable({ name: 'services_has_roles', joinColumn: { name: 'serviceId', referencedColumnName: 'id' }, inverseJoinColumn: { name: 'rolesId', referencedColumnName: 'id' } })
    roles?: Role[];
}
