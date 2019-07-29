import { Repository, DeleteResult } from 'typeorm';
import Menu from '../models/menu.entity';
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuDTO } from '../models/menu.dto';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
    ) {}

    async all(): Promise<Menu[]> {
        const result: Menu[] = await this.menuRepository.find();
        return result;
    }

    async add(form: MenuDTO): Promise<Menu> {
        const result: Menu = await this.menuRepository.save(form);
        return result;
        // const role: Role = new Role();
        // role.code = form.code;
        // await this.menuRepository.save(role);

        // const menu: Menu = new Menu();
        // menu.code = form.code;
        // menu.name = form.name;
        // const result: Menu = await this.menuRepository.save(menu);

        // return result;
    }

    async get(id: number): Promise<Menu> {
        const result: Menu = await this.menuRepository.findOne(id);
        if (!result) throw new NotFoundException(`Menu with id: ${id} Not Found`);
        try {
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async update(id: number, form: MenuDTO): Promise<Menu> {
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
