import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Region from '../models/region.entity';
import { Repository, DeleteResult } from 'typeorm';
import { RegionDTO } from '../models/region.dto';

@Injectable()
export default class RegionService {

    constructor(@InjectRepository(Region) private regionRepository: Repository<Region>) { }

    async findAll(): Promise<Region[]> {
        return await this.regionRepository.find();
    }

    async findById(id: string): Promise<Region> {
        return await this.regionRepository.findOne(id);
    }

    async create(regionDto: RegionDTO): Promise<Region> {
        const exist: boolean = await this.regionRepository.count({ where: { name: regionDto.name } }) === 1;
        if (exist) throw new BadRequestException('Data ini telah ada.');
        return await this.regionRepository.save(regionDto);
    }

    async remove(id: string): Promise<DeleteResult> {
        const isExist: boolean = (await this.regionRepository.count({ id })) > 0;
        if (!isExist) throw new NotFoundException(`Region with id: ${id} not found`);
        else return await this.regionRepository.delete(id);
    }

    async update(id: string, regionDto: RegionDTO): Promise<Region> {
        let data: Region = await this.regionRepository.findOne({
            where: { id },
        });

        if (!data) throw new NotFoundException(`Region with id: ${id} not found`);
        else {
            const exist: boolean = await this.regionRepository.count({ where: { name: regionDto.name } }) === 1;
            if (exist && regionDto.name !== data.name) throw new BadRequestException('Data ini telah ada.');
            data = this.regionRepository.merge(data, regionDto);
            return await this.regionRepository.save(data);
        }
    }
}
