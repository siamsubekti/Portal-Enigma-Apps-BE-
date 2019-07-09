import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('mst_templates')
export default class Template {

    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'varchar', length: 255, nullable: false})
    name: string;

    @Column({type: 'varchar', length: 50, nullable: false})
    type: string;

    @Column({type: 'varchar', length: 255, nullable: true})
    subject: string;

    @Column({type: 'text', nullable: false})
    body: string;

    @Column({name: 'created_at', type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}