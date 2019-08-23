import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { HttpMethod } from 'src/config/constants';
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

    @Column({ type: 'varchar', length: 6, nullable: false })
    method: HttpMethod;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToMany(() => Role, (role: Role) => role.services)
    roles?: Role[];
}
