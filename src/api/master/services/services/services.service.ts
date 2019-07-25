import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import Service from '../models/service.entity';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceDTO, ServiceQueryDTO, ServiceQueryResult } from '../models/service.dto';

@Injectable()
export class ServicesService {

    constructor(@InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    ) {

    }

    async findAll(queryParams: ServiceQueryDTO): Promise<ServiceQueryResult> {
        let query: SelectQueryBuilder<Service> = this.serviceRepository.createQueryBuilder('s')
            .leftJoinAndSelect('s.roles', 'r');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('s.code LIKE :term', { term })
                .orWhere('s.name LIKE :term', { term })
                .orWhere('r.code LIKE :term', { term })
                .orWhere('r.name LIKE :term', { term });
        }

        if (queryParams.order && queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            const orderCols: { [key: string]: string } = {
                code: 's.code',
                name: 'r.name',
            };
            query = query.orderBy(orderCols[queryParams.order], sort);
        } else
            query = query.orderBy('s.code', 'ASC');

        query.offset(queryParams.page > 1 ? (queryParams.rowsPerPage * queryParams.page) + 1 : 0);
        query.limit(queryParams.rowsPerPage);

        const result: [Service[], number] = await query.getManyAndCount();
        Logger.log(queryParams, 'ServiceService@findAll', true);

        return {
            result: result[0],
            totalRows: result[1],
        };
        // return await this.serviceRepository.find();
    }

    async findById(id: number): Promise<Service> {
        return await this.serviceRepository.findOne({ where: { id } });
    }

    async create(serviceDto: ServiceDTO): Promise<Service> {
        const service: Service = await this.serviceRepository.findOne({ where: { code: serviceDto.code } });
        if (service) throw new BadRequestException('Data ini telah ada.');
        else return await this.serviceRepository.save(serviceDto);
    }

    async remove(id: number): Promise<DeleteResult> {
        const service: boolean = await this.serviceRepository.count({ where: { id } }) === 1;
        if (!service) throw new NotFoundException(`Service with id : ${id} not found.`);
        return await this.serviceRepository.delete(id);
    }

    async update(id: number, serviceDto: ServiceDTO): Promise<Service> {
        let service: Service = await this.serviceRepository.findOne({ where: { id } });
        if (!service) throw new NotFoundException(`Service with id : ${id} not found.`);
        else {
            service = await this.serviceRepository.merge(serviceDto);
            return await this.serviceRepository.save(service);
        }
    }
}
