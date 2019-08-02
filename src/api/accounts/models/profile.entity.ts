import { Entity, PrimaryColumn, Generated, Column, OneToOne } from 'typeorm';
import Account from './account.entity';
import { ProfileGender, ProfileReligion, ProfileMaritalStatus } from '../../../config/constants';

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

  @Column({enum: ProfileGender, length: 10, nullable: true})
  gender: ProfileGender;

  @Column({enum: ProfileReligion, length: 50, nullable: true})
  religion: ProfileReligion;

  @Column({enum: ProfileMaritalStatus, length: 20, nullable: true, name: 'marital_status'})
  maritalStatus: ProfileMaritalStatus;

  @Column({name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({name: 'updated_at', type: 'timestamp', nullable: true})
  updatedAt: Date;

  @OneToOne(() => Account, (account: Account) => account.profile)
  account: Account;
}
