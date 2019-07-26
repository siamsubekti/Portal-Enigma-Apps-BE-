import { Entity, Column, ManyToMany, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import Role from '../../roles/models/role.entity';

@Entity('mst_menus')
export default class Menu {
    @PrimaryGeneratedColumn({type: 'int', unsigned: true})
    id: number;

    @Column({type: 'varchar', length: 50, nullable: false, unique: true})
    code: string;

    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({type: 'smallint'})
    order: number;

    @Column({type: 'varchar', length: 50})
    icon: string;

    @Column({name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @ManyToOne(() => Menu, (menu: Menu) => menu.childrenMenu)
    @JoinColumn({name: 'parent_id'})
    parentMenu: Menu;

    @OneToMany(() => Menu, (menu: Menu) => menu.parentMenu)
    childrenMenu: Menu[];

    @ManyToMany(() => Role, (role: Role) => role.menus)
    roles: Role[];
}
