import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Region from '../models/region.entity';
import { Repository, DeleteResult } from 'typeorm';
import { RegionDTO } from '../models/region.dto';
let logger = new Logger;

@Injectable()
export class RegionService {

    constructor(@InjectRepository(Region) private regionRepository : Repository<Region>) {}

    async findAll(): Promise<Region[]>{
        const regions = await this.regionRepository.find();
        return regions;
    }

    async create(regionDto: RegionDTO): Promise<Region>{
        const region = await this.regionRepository.save(regionDto);
        logger.log(`Insert into regions with id : ${region.id}`);
        return region;
    }

    async remove(id): Promise<DeleteResult>{
        const region = await this.regionRepository.delete(id);
        if (region.affected < 1) {
            throw new HttpException('Failed to delete job', HttpStatus.NOT_FOUND);
        }
        return region;
    }

}
