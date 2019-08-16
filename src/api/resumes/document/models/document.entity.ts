import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

@Entity({name: 'documents'})
export default class Document {

    @PrimaryColumn({ type: 'varchar', length: 64, nullable: false })
    @Generated('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 5, nullable: false })
    type: string;

    @Column({ type: 'int', nullable: false })
    size: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    filepath: string;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp', nullable: true })
    updatedAt: Date;

    @Column({ name: 'account_id', type: 'varchar', nullable: false })
    accountId: string;
}
