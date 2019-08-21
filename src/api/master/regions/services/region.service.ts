import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Region from '../models/region.entity';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { RegionDTO, RegionQueryDTO, RegionQueryResult } from '../models/region.dto';

@Injectable()
export default class RegionService {

    constructor(@InjectRepository(Region) private regionRepository: Repository<Region>) { }

    async findAll(): Promise<Region[]> {
        return await this.regionRepository.find();
    }

    async findById(id: string): Promise<Region> {
        return await this.regionRepository.findOne({ where: { id } });
    }

    async findChild(id: string): Promise<Region> {
        return await this.regionRepository.findOne({ where: { id }, relations: ['children'] });
    }

    async create(regionDto: RegionDTO): Promise<Region> {
        const exist: boolean = await this.regionRepository.count({ where: { name: regionDto.name } }) === 1;
        if (exist) throw new BadRequestException('Data ini telah ada.');

        const region: Region = new Region();
        region.name = regionDto.name;
        region.type = regionDto.type;
        const parent: Region = await this.findParent(regionDto.parent);
        region.parent = parent;

        return await this.regionRepository.save(region);
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
            if (exist && (regionDto.name !== data.name)) throw new BadRequestException('Data ini telah ada.');
            data = this.regionRepository.merge(data, regionDto);
            return await this.regionRepository.save(data);
        }
    }

    async search(queryParams: RegionQueryDTO): Promise<RegionQueryResult> {
        let query: SelectQueryBuilder<Region> = this.regionRepository.createQueryBuilder('region');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('region.type LIKE :term', { term })
                .orWhere('region.name LIKE :term', { term });
        }

        if (queryParams.order && queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            const orderCols: { [key: string]: string } = {
                type: 'region.type',
                name: 'region.name',
            };
            query = query.orderBy(orderCols[queryParams.order], sort);
        } else
            query = query.orderBy('region.name', 'ASC');

        query.limit(100);

        const result: [Region[], number] = await query.getManyAndCount();
        // Logger.log(queryParams, 'RegionService@search', true);

        return {
            result: result[0],
            totalRows: result[1],
        };
    }

    async find(queryParams: RegionQueryDTO): Promise<RegionQueryResult> {
        const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * (queryParams.page - 1)) : 0;
        let query: SelectQueryBuilder<Region> = this.regionRepository.createQueryBuilder('region');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('region.type LIKE :term', { term })
                .orWhere('region.name LIKE :term', { term });
        }

        if (queryParams.order && queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            const orderCols: { [key: string]: string } = {
                name: 'region.name',
                type: 'region.type',
            };
            query = query.orderBy(orderCols[queryParams.order], sort);
        } else
            query = query.orderBy('region.name', 'ASC');

        query.offset(offset);
        query.limit(queryParams.rowsPerPage);

        const result: [Region[], number] = await query.getManyAndCount();
        // Logger.log(queryParams, 'RegionService@find', true);

        return {
            result: result[0],
            totalRows: result[1],
        };
    }

    async findByType(queryParams: RegionQueryDTO): Promise<Region[]> {
        return await this.regionRepository.find({
            where: {
                type: queryParams.term,
            },
            order: {
                name: queryParams.sort.toUpperCase() as 'ASC' | 'DESC',
            },
        });
    }

    async findParent(region: Region): Promise<Region> {
        return await this.regionRepository.findOne({ where: { id: region.id } });
    }
}
