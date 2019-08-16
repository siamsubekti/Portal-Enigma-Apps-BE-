import { Injectable, InternalServerErrorException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Role from '../models/role.entity';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { RoleDTO, RoleQueryDTO, RoleQueryResult } from '../models/role.dto';
import ServicesService from '../../services/services/services.service';
import MenuService from '../../menus/services/menu.service';

@Injectable()
export default class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        private readonly serviceServices: ServicesService,
        private readonly menuServices: MenuService,
    ) { }

    async all(queryParams: RoleQueryDTO): Promise<RoleQueryResult> {
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

        query.offset(queryParams.page > 1 ? (queryParams.rowsPerPage * queryParams.page) + 1 : 0);
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
        // Logger.log(checkCode);
        if (checkCode) throw new BadRequestException('This role code is already taken.');
        try {
            const { code, name, menus, services } = roleDTO;
            const role: Role = new Role();
            role.code = code;
            role.name = name;
            role.menus = this.menuServices.findAllRelated(menus);
            role.services = this.serviceServices.findAllRelated(services);

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

    async delete(id: number): Promise<DeleteResult> {
        const countId: boolean = await this.roleRepository.count({ id }) > 0;
        if (!countId) throw new NotFoundException(`Role with id: ${id} Not Found`);
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
