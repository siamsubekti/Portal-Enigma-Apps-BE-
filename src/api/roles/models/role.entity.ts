import { PrimaryColumn, Generated, Column, Entity } from 'typeorm';

@Entity('mst_roles')
export default class Role {
    @PrimaryColumn({ type: 'int', unsigned: true})
    @Generated()
    id: number;

    @Column({ type: 'varchar', length: 25, nullable: false, unique: true})
    code: string;

    @Column({ type: 'varchar', length: 25, nullable: false})
    name: string;

    @Column({name: 'created_at', type: 'timestamp', nullable: false, default: 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}
