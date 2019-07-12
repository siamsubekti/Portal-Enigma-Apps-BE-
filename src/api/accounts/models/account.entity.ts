import { Entity, PrimaryColumn, Generated, Column, OneToOne, JoinColumn } from 'typeorm';
import Profile from './profile.entity';

@Entity('accounts')
export default class Account {
  @PrimaryColumn({type: 'varchar', length: 64})
  @Generated('uuid')
  id: string;

  @Column({type: 'varchar', length: 255, unique: true, nullable: false})
  username: string;

  @Column({type: 'varchar', length: 64, nullable: false})
  password: string;

  @Column({type: 'varchar', length: 15, nullable: false, default: 'INACTIVE'})
  status: 'INACTIVE' | 'ACTIVE' | 'SUSPENDED' | 'BLACKLISTED';

  @Column({name: 'created_at', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({name: 'updated_at', type: 'timestamp', nullable: true})
  updatedAt: Date;

  @OneToOne(type => Profile)
  @JoinColumn({name: 'profile_id'})
  profile: Profile;
}
