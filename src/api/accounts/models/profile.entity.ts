import { Entity, PrimaryColumn, Generated, Column } from 'typeorm';

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
  gender: 'LAKI-LAKI' | 'PEREMPUAN';

  @Column({type: 'varchar', length: 50, nullable: true})
  religion: 'BUDHA' | 'HINDU' | 'ISLAM' | 'KONG HU CHU' | 'KRISTEN PROTESTAN' | 'KRISTEN KATOLIK';

  @Column({type: 'varchar', length: 20, nullable: true})
  maritalStatus: 'KAWIN' | 'BELUM KAWIN' | 'DUDA' | 'JANDA';

  @Column({name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({name: 'updated_at', type: 'timestamp', nullable: true})
  updatedAt: Date;
}
