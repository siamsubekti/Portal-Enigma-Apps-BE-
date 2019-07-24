import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mst_skills')
export default class Skill {

    @PrimaryGeneratedColumn({type: 'int'})
    id: number;

    @Column({type: 'varchar', length: 255, nullable: false, unique: true})
    name: string;

    @Column({type: 'text', nullable: true})
    description: string;

    @Column({name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}
