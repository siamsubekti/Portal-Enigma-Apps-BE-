import { Injectable, BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import Service from '../models/service.entity';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceDTO, ServiceQueryDTO, ServiceQueryResult } from '../models/service.dto';
import { ServiceType } from '../../../../config/constants';
import Role from '../../roles/models/role.entity';

@Injectable()
export default class ServicesService {

  constructor(@InjectRepository(Service)
  private serviceRepository: Repository<Service>,
  ) {}

  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find();
  }

  async find(queryParams: ServiceQueryDTO): Promise<ServiceQueryResult> {
    const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * (queryParams.page - 1)) : 0;
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

  async findAllByServiceType(serviceType: ServiceType): Promise<Service[]> {
    return await this.serviceRepository.find({ serviceType });
  }

  async create(serviceDto: ServiceDTO): Promise<Service> {
    const service: Service = await this.serviceRepository.findOne({ where: { code: serviceDto.code } });
    if (service) throw new BadRequestException('Data already exists.');
    else return await this.serviceRepository.save(serviceDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    const service: Service = await this.findById(id);
    if (!service) throw new NotFoundException(`Service with ID ${id} cannot be found.`);

    const roles: Role[] = service ? await service.roles : [];
    if (roles.length > 0) throw new UnprocessableEntityException(`Unable to delete service, this service is currently being used by ${roles.length} role(s).`);

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
}
