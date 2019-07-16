import { Injectable, InternalServerErrorException, BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Role from '../models/role.entity';
import { Repository, DeleteResult } from 'typeorm';
import { RoleResponseDTO, RoleDTO } from '../models/role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async getRoles(): Promise<RoleResponseDTO[]> {
        const role: Role[] = await this.roleRepository.find();
        try {
            return role;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async insertRole(roleDTO: RoleDTO): Promise<RoleResponseDTO> {
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

    async getRole(id: number): Promise<RoleResponseDTO> {
        const role: Role = await this.roleRepository.findOne(id);
        if (!role) throw new NotFoundException(`Role with id: ${id} Not Found`);
        try {
            return role;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async updateRole(id: number, roleDTO: RoleDTO): Promise<RoleResponseDTO> {
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

    async deleteRole(id: number): Promise<DeleteResult> {
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
