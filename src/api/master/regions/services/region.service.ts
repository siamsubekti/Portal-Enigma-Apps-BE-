import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Region from '../models/region.entity';
import { Repository, DeleteResult } from 'typeorm';
import { RegionDTO } from '../models/region.dto';

@Injectable()
export class RegionService {

    constructor(@InjectRepository(Region) private regionRepository: Repository<Region>) { }

    async findAll(): Promise<Region[]> {
        try {
            const regions: Region[] = await this.regionRepository.find();
            return regions;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async create(regionDto: RegionDTO): Promise<Region> {
        try {
            const region: Region = await this.regionRepository.save(regionDto);
            Logger.log(`Insert into regions with id : ${region.id}`);
            return region;
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException();
        }
    }

    async remove(id: string): Promise<DeleteResult> {
        const isExist: boolean = (await this.regionRepository.count({ id })) > 0;
        if (!isExist) {
            throw new NotFoundException(`Region with id: ${id} not found`);
        } else {
            try {
                const region: DeleteResult = await this.regionRepository.delete(id);
                return region;
            } catch (error) {
                throw new InternalServerErrorException();
            }
        }
    }

    async update(id: string, regionDto: RegionDTO): Promise<Region> {
        let data: Region = await this.regionRepository.findOne({
            where: {
                id
            }
        });

        if (!data) {
            throw new NotFoundException(`Region with id: ${id} not found`);
        } else {
            try {
                data = this.regionRepository.merge(data, regionDto);
                const region: Region = await this.regionRepository.save(data);
                return region;
            } catch (error) {
                throw new InternalServerErrorException()
            }
        }
    }
}
