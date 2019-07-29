import { Repository, DeleteResult } from 'typeorm';
import Menu from '../models/menu.entity';
import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuDTO } from '../models/menu.dto';

@Injectable()
export default class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
    ) { }

    async all(): Promise<Menu[]> {
        const result: Menu[] = await this.menuRepository.find({ relations: ['childrenMenu'] });
        return result;
    }

    async add(form: MenuDTO): Promise<Menu> {
        const checkCode: Menu = await this.menuRepository.findOne({where: {code: form.code}});
        if (checkCode) throw new BadRequestException('Code has been use');
        const parent: Menu = await this.menuRepository.findOne(form.parentId);
        Logger.log(parent);
        const menu: Menu = new Menu();
        menu.code = form.code;
        menu.name = form.name;
        menu.order = form.order;
        menu.icon = form.icon;
        menu.parentMenu = parent;
        const result: Menu = await this.menuRepository.save(menu);

        return result;
    }

    async get(id: number): Promise<Menu> {
        const result: Menu = await this.menuRepository.findOne(id, {relations: ['childrenMenu']});
        if (!result) throw new NotFoundException(`Menu with id: ${id} Not Found`);
        try {
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async update(id: number, form: MenuDTO): Promise<Menu> {
        const result: Menu = await this.menuRepository.findOne({ where: { id } });
        if (!result) throw new NotFoundException(`Menu with id: ${id} Not Found`);
        try {
            const data: Menu = this.menuRepository.merge(result, form);
            const updateData: Menu = await this.menuRepository.save(data);
            return updateData;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        const result: boolean = await this.menuRepository.count({ id }) > 0;
        if (!result) throw new NotFoundException(`Menu with id: ${id} Not Found`);
        try {
            const removeMenu: DeleteResult = await this.menuRepository.delete(id);
            return removeMenu;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }
}
