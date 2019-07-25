import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import Role from '../../roles/models/role.entity';

@Entity('mst_menus')
export default class Menu {
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    id: number;

    @Column({type: 'varchar', length: 50, nullable: false, unique: true})
    code: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({type: 'smallint', length: 3})
    order: number;

    @Column({name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @OneToMany(() => Menu, (menu: Menu) => menu.children)
    @JoinColumn({name: 'children_id'})
    children: Menu;

    @ManyToMany(() => Role, (role: Role) => role.menus)
    roles: Role[];
}
