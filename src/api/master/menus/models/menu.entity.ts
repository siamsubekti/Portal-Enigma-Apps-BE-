import { Entity, PrimaryColumn, Generated, Column, ManyToMany, JoinColumn, PrimaryGeneratedColumn, JoinTable } from 'typeorm';
import Role from '../../roles/models/role.entity';

@Entity('mst_menus')
export default class Menu {
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    id: number;

    @Column({type: 'varchar', length: 50, nullable: false, unique: true})
    code: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @ManyToMany((type: Role) => Role, (role: Role) => role.menus)
    roles: Role;
}
