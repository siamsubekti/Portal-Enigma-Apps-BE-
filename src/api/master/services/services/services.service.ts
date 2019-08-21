import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import Service from '../models/service.entity';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceDTO, ServiceQueryDTO, ServiceQueryResult } from '../models/service.dto';

@Injectable()
export default class ServicesService {

    constructor(@InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    ) {

    }

    async findAll(): Promise<Service[]> {
        return await this.serviceRepository.find();
    }

    async find(queryParams: ServiceQueryDTO): Promise<ServiceQueryResult> {
        const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * ( queryParams.page - 1)) : 0;
        let query: SelectQueryBuilder<Service> = this.serviceRepository.createQueryBuilder('s');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('s.code LIKE :term', { term })
                .orWhere('s.name LIKE :term', { term });
        }

        if (queryParams.order && queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            const orderCols: { [key: string]: string } = {
                code: 's.code',
                name: 's.name',
            };
            query = query.orderBy(orderCols[queryParams.order], sort);
        } else
            query = query.orderBy('s.code', 'ASC');

        query.offset(offset);
        query.limit(queryParams.rowsPerPage);

        const result: [Service[], number] = await query.getManyAndCount();
        // Logger.log(queryParams, 'ServiceService@findAll', true);
        // console.log('queryParams:', queryParams, 'offset:', offset, 'limit:', limit);

        return {
            result: result[0],
            totalRows: result[1],
        };
    }

    async findById(id: number): Promise<Service> {
        return await this.serviceRepository.findOne({ where: { id }, relations: ['roles'] });
    }

    async findByCode(code: string): Promise<Service> {
        return await this.serviceRepository.findOne({ where: { code } });
    }

    async create(serviceDto: ServiceDTO): Promise<Service> {
        const service: Service = await this.serviceRepository.findOne({ where: { code: serviceDto.code } });
        if (service) throw new BadRequestException('Data ini telah ada (PAKEK BAHASA INGGERIS BIAR KEKINIAN OY!).');
        else return await this.serviceRepository.save(serviceDto);
    }

    async remove(id: number): Promise<DeleteResult> {
        const service: boolean = await this.serviceRepository.count({ where: { id } }) === 1;
        if (!service) throw new NotFoundException(`Service with id : ${id} not found.`);
        return await this.serviceRepository.delete(id);
    }

    async update(id: number, form: ServiceDTO): Promise<Service> {
        const service: Service = await this.serviceRepository.findOne({ where: { id } });
        if (!service) throw new NotFoundException(`Service with id : ${id} not found.`);
        else {
            service.code = form.code;
            service.name = form.name;
            service.endpointUrl = form.endpointUrl;
            service.method = form.method;
            const query: SelectQueryBuilder<Service> = this.serviceRepository.createQueryBuilder('s')
                .leftJoin('s.roles', 'r');

            await query
                .update(service)
                .where('id = :id', { id })
                .execute();

            return service;
        }
    }

    async createBulk(data: ServiceDTO[]): Promise<Service[]> {
        const services: Service[] = data.map((service: ServiceDTO) => this.serviceRepository.create(service));

        return await this.serviceRepository.save(services);
    }

    async findAllRelated(services: Service[]): Promise<Service[]> {
        const serviceIds: number[] = services.map((item: Service) => item.id);
        return await this.serviceRepository.findByIds(serviceIds);
    }

    async search(queryParams: ServiceQueryDTO): Promise<ServiceQueryResult> {
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

        query.limit(1000);

        const result: [Service[], number] = await query.getManyAndCount();
        // Logger.log(queryParams, 'ServiceService@search', true);

        return {
            result: result[0],
            totalRows: result[1],
        };
    }
}
