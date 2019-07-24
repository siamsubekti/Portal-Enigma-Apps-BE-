import { PrimaryColumn, Generated, Column, Entity, ManyToMany, JoinTable, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import Account from '../../../../api/accounts/models/account.entity';
import Menu from '../../menus/models/menu.entity';

@Entity('mst_roles')
export default class Role {
    @PrimaryGeneratedColumn({ type: 'int', unsigned: true})
    id: number;

    @Column({ type: 'varchar', length: 25, nullable: false, unique: true})
    code: string;

    @Column({ type: 'varchar', length: 25, nullable: false})
    name: string;

    @Column({name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @ManyToMany((type: Account) => Account, (account: Account) => account.roles)
    account: Account;

    @ManyToMany((type: Menu) => Menu, (menu: Menu) => menu.roles)
    @JoinTable({name: 'roles_has_menus', joinColumn: {name: 'role_id', referencedColumnName: 'id'},
    inverseJoinColumn: {name: 'menu_id', referencedColumnName: 'id'}})
    menus: Menu;
}
