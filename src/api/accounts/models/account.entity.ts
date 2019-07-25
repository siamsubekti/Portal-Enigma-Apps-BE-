import { Entity, PrimaryColumn, Generated, Column, OneToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import Profile from './profile.entity';
import Role from '../../../api/master/roles/models/role.entity';

@Entity('accounts')
export default class Account {
  @PrimaryColumn({type: 'varchar', length: 64})
  @Generated('uuid')
  id: string;

  @Column({type: 'varchar', length: 255, unique: true, nullable: false})
  username: string;

  @Column({type: 'varchar', length: 64, nullable: false, select: false })
  password: string;

  @Column({type: 'varchar', length: 15, nullable: false, default: 'INACTIVE'})
  status: 'INACTIVE' | 'ACTIVE' | 'SUSPENDED' | 'BLACKLISTED';

  @Column({name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({name: 'updated_at', type: 'timestamp', nullable: true})
  updatedAt: Date;

  @OneToOne((type: Profile) => Profile, (profile: Profile) => profile.account)
  @JoinColumn({name: 'profile_id'})
  profile: Profile;

  @ManyToMany((type: Role) => Role, (role: Role) => role.account)
  @JoinTable({
    name: 'accounts_has_roles',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'account_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
