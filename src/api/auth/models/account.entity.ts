import { Entity, PrimaryColumn, Generated, Column } from 'typeorm';

@Entity('accounts')
export default class Account {
  @PrimaryColumn({type: 'varchar', length: 64})
  @Generated('uuid')
  id: string;

  @Column({type: 'varchar', length: 255, unique: true, nullable: false})
  username: string;

  @Column({type: 'varchar', length: 64, nullable: false})
  password: string;

  @Column({type: 'varchar', length: 15, nullable: false, default: 'DEACTIVATED'})
  status: 'DEACTIVATED' | 'ACTIVATED' | 'SUSPENDED' | 'BLACKLISTED';

  @Column({type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @Column({type: 'timestamp', nullable: true})
  updatedAt: Date;
}
