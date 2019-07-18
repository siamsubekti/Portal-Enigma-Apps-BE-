import { Entity, PrimaryColumn, Generated, Column, OneToOne, JoinColumn } from 'typeorm';
import Account from './account.entity';

@Entity('profiles')
export default class Profile {
  @PrimaryColumn({type: 'varchar', length: 64})
  @Generated('uuid')
  id: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  fullname: string;

  @Column({type: 'varchar', length: 125, unique: true, nullable: false})
  nickname: string;

  @Column({type: 'varchar', length: 255, unique: true, nullable: false})
  email: string;

  @Column({type: 'varchar', length: 18, nullable: false})
  phone: string;

  @Column({type: 'date', nullable: true})
  birthdate: Date;

  @Column({type: 'varchar', length: 10, nullable: true})
  gender: 'MALE' | 'FEMALE';

  @Column({type: 'varchar', length: 50, nullable: true})
  religion: 'BUDDHA' | 'HINDU' | 'ISLAM' | 'KONG HU CHU' | 'CHRISTIAN' | 'CATHOLIC';

  @Column({type: 'varchar', length: 20, nullable: true, name: 'marital_status'})
  maritalStatus: 'SINGLE' | 'IN RELATIONSHIP' | 'MARRIED' | 'DIVORCED';

  @Column({name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({name: 'updated_at', type: 'timestamp', nullable: true})
  updatedAt: Date;

  @OneToOne((type: Account) => Account, (account: Account) => account.profile)
  account: Account;
}
