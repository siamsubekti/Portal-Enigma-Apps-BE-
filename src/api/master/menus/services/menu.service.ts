import { Repository, DeleteResult } from 'typeorm';
import Menu from '../models/menu.entity';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuResponseDTO, MenuDTO } from '../models/menu.dto';
import Role from '../../roles/models/role.entity';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
    ) {}

    async getMenus(): Promise<Menu[]> {
        const result: Menu[] = await this.menuRepository.find();
        return result;
    }

    async addMenu(form: MenuDTO): Promise<MenuResponseDTO> {
        const role: Role = new Role();
        role.code = form.code;
        await this.menuRepository.save(role);

        const menu: Menu = new Menu();
        menu.code = form.code;
        menu.name = form.name;
        menu.roles = (role);
        const result: Menu = await this.menuRepository.save(menu);

        return result;
    }

    async getMenu(id: number): Promise<MenuResponseDTO> {
        const result: Menu = await this.menuRepository.findOne(id);
        if (!result) throw new NotFoundException(`Menu with id: ${id} Not Found`);
        try {
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async update(id: number, form: MenuDTO): Promise<MenuResponseDTO> {
        const result: Menu = await this.menuRepository.findOne({where: {id}});
        if (!result) throw new NotFoundException(`Menu with id: ${id} Not Found`);
        try {
            const data: Menu = this.menuRepository.merge(result, form);
            const updateData: Menu = await this.menuRepository.save(data);
            return updateData;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        const result: boolean = await this.menuRepository.count({id}) >  0;
        if (!result) throw new NotFoundException(`Menu with id: ${id} Not Found`);
        try {
            const removeMenu: DeleteResult = await this.menuRepository.delete(id);
            return removeMenu;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}