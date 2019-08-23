import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Role from '../models/role.entity';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { RoleDTO, RoleQueryDTO, RoleQueryResult } from '../models/role.dto';
import ServicesService from '../../services/services/services.service';
import MenuService from '../../menus/services/menu.service';
import Menu from '../../menus/models/menu.entity';
import Service from '../../services/models/service.entity';

@Injectable()
export default class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly serviceServices: ServicesService,
        private readonly menuServices: MenuService,
    ) { }

    async all(queryParams: RoleQueryDTO): Promise<RoleQueryResult> {
        const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * (queryParams.page - 1)) : 0;
        let query: SelectQueryBuilder<Role> = this.roleRepository.createQueryBuilder('r');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('r.code LIKE :term', { term })
                .orWhere('r.name LIKE :term', { term });
        }

        if (queryParams.order && queryParams.sort) {
            const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
            const orderCols: { [key: string]: string } = {
                code: 'r.code',
                name: 'r.name',
            };

            query = query.orderBy(orderCols[queryParams.order], sort);
        } else
            query = query.orderBy('r.name', 'ASC');

        query.offset(offset);
        query.limit(queryParams.rowsPerPage);

        const result: [Role[], number] = await query.getManyAndCount();

        return {
            result: result[0],
            totalRows: result[1],
        };
    }

    async insert(roleDTO: RoleDTO): Promise<Role> {
        const checkCode: Role = await this.roleRepository.findOne({
            where: { code: roleDTO.code },
        });
        // // Logger.log(checkCode);
        if (checkCode) throw new BadRequestException('This role code is already taken.');
        try {
            const { code, name, menus, services } = roleDTO;
            const role: Role = new Role();
            const menu: Menu[] = await this.menuServices.findAllRelated(menus);
            const service: Service[] = await this.serviceServices.findAllRelated(services);

            role.code = code;
            role.name = name;
            role.menus = Promise.resolve(menu);
            role.services = Promise.resolve(service);

            return await this.roleRepository.save(role);
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async get(id: number): Promise<Role> {
        const role: Role = await this.roleRepository.findOne(id);
        if (!role) throw new NotFoundException(`Role with id: ${id} Not Found`);
        try {
            return role;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async update(id: number, roleDTO: RoleDTO): Promise<Role> {
        const role: Role = await this.roleRepository.findOne(id);
        if (!role) throw new NotFoundException(`Role with id: ${id} Not Found`);
        try {
            const { code, name, menus, services } = roleDTO;
            role.code = code;
            role.name = name;
            role.menus = Promise.resolve(menus);
            role.services = Promise.resolve(services);
            const result: Role = await this.roleRepository.save(role);
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async getRelations(id: number): Promise<Role> {
        return await this.roleRepository.findOne({ where: { id }, relations: ['account', 'services', 'menus'] });
    }

    async delete(id: number): Promise<DeleteResult> {
        const roles: Role = await this.getRelations(id);
        const menus: Menu[] = await Promise.resolve(roles.menus);
        const services: Service[] = await Promise.resolve(roles.services);
        if (!roles) throw new NotFoundException(`Role with id: ${id} Not Found`);
        else if ( roles && menus.length > 0 ) throw new UnprocessableEntityException('Failed to delete, roles is use by another.');
        else if ( roles && services.length > 0 ) throw new UnprocessableEntityException('Failed to delete, roles is use by another.');
        else
        try {
            const result: DeleteResult = await this.roleRepository.delete(id);
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async createBulk(data: RoleDTO[]): Promise<Role[]> {
        const roles: Role[] = [];

        for (const item of data) {
            const { code, name, menus, services } = item;
            const role: Role = new Role();
            role.code = code;
            role.name = name;
            role.menus = Promise.resolve(menus);
            role.services = Promise.resolve(services);

            roles.push(role);
        }

        return await this.roleRepository.save(roles);
    }

    async findAllRelated(roles: Role[]): Promise<Role[]> {
        const roleIds: number[] = roles.map((item: Role) => item.id);
        return await this.roleRepository.findByIds(roleIds);
    }
}
