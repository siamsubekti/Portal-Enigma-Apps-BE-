import { Column, Entity, ManyToMany, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import Service from '../../services/models/service.entity';
import Menu from '../../menus/models/menu.entity';
import Account from '../../../accounts/models/account.entity';

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

  @ManyToMany((type: Account) => Account, (account: Account) => account.roles)
  account: Account;

  @ManyToMany(() => Service, (service: Service) => service.roles)
  services: Service[];

  @ManyToMany((type: Menu) => Menu, (menu: Menu) => menu.roles, { eager: true })
  @JoinTable({
    name: 'roles_has_menus',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' }
  })
  menus: Menu;
}
