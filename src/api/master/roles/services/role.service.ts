import { Injectable, InternalServerErrorException, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Role from '../models/role.entity';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { RoleResponseDTO, RoleDTO, RoleQueryDTO, RoleQueryResult } from '../models/role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async all(queryParams: RoleQueryDTO): Promise<RoleQueryResult> {
        let query: SelectQueryBuilder<Role> = this.roleRepository.createQueryBuilder('r').select('r');

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

          query = query.orderBy( orderCols[ queryParams.order ], sort );
        } else
          query = query.orderBy( 'r.name', 'ASC' );

        query.offset( queryParams.page > 1 ? ( queryParams.rowsPerPage * queryParams.page ) + 1 : 0 );
        query.limit( queryParams.rowsPerPage );

        const result: [ Role[], number ] = await query.getManyAndCount();
        Logger.log(queryParams, 'RoleService@all', true);

        return {
          result: result[0],
          totalRows: result[1],
        };
    }

    async insert(roleDTO: RoleDTO): Promise<RoleResponseDTO> {
        const checkCode: Role = await this.roleRepository.findOne({
            where: {code: roleDTO.code}});
        Logger.log(checkCode);
        if (checkCode) throw new BadRequestException('Code Has Been Use');
        try {
            const role: Role = await this.roleRepository.save(roleDTO);
            Logger.log(role);
            return role;
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

    async update(id: number, roleDTO: RoleDTO): Promise<RoleResponseDTO> {
        let role: Role = await this.roleRepository.findOne({where: {id}});
        if (!role) throw new NotFoundException(`Role with id: ${id} Not Found`);
        try {
            role = this.roleRepository.merge(role, roleDTO);
            const result: Role = await this.roleRepository.save(role);
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        const countId: boolean = await this.roleRepository.count({id}) > 0;
        if (!countId) throw new NotFoundException(`Role with id: ${id} Not Found`);
        try {
            const result: DeleteResult = await this.roleRepository.delete(id);
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }
}
