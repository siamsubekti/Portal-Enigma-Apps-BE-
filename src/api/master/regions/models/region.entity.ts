import { Entity, Column, PrimaryColumn, Generated, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('mst_regions')
export default class Region {

    @PrimaryColumn({ type: 'varchar', length: 64, nullable: false })
    @Generated('uuid')
    id: string;

    @Column({ type: 'varchar', length: 32, nullable: false })
    type: 'KELURAHAN' | 'KECAMATAN' | 'KABUPATEN' | 'KOTA' | 'PROVINSI';

    @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
    name: string;

    @Column({ name: 'created_at', type: 'timestamp', nullable: false, default: (): string => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @ManyToOne(() => Region, (region: Region) => region.children)
    @JoinColumn({name: 'parent_id'})
    parent: Region;

    @OneToMany(() => Region, (region: Region) => region.parent)
    children: Region[];
}
