import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import Menu from '../models/menu.entity';
import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuDTO, MenuQueryDTO, MenuQueryResult } from '../models/menu.dto';

@Injectable()
export default class MenuService {
    constructor(
        @InjectRepository(Menu)
        private readonly menuRepository: Repository<Menu>,
    ) { }

    async all(queryParams: MenuQueryDTO): Promise<MenuQueryResult> {
        let query: SelectQueryBuilder<Menu> = this.menuRepository.createQueryBuilder('m').select('m');

        if (queryParams.term) {
            let { term } = queryParams;
            term = `%${term}%`;
            query = query
                .orWhere('m.code LIKE :term', { term })
                .orWhere('m.name LIKE :term', { term })
                .orWhere('m.order LIKE :term', { term })
                .orWhere('m.icon LIKE :term', { term });
        }

        query.offset(queryParams.page > 1 ? (queryParams.rowsPerPage * queryParams.page) + 1 : 0);
        query.limit(queryParams.rowsPerPage);

        const result: [Menu[], number] = await query.getManyAndCount();
        Logger.log(queryParams, 'MenuService@all', true);

        return {
            result: result[0],
            totalRows: result[1],
        };
    }

    async allSub(): Promise<MenuQueryResult> {
        const query: SelectQueryBuilder<Menu> = this.menuRepository.createQueryBuilder('m').select('m')
        .where('m.parentMenu');

        const result: [Menu[], number] = await query.getManyAndCount();

        return {
            result: result[0],
            totalRows: result[1],
        };
    }

    async add(form: MenuDTO): Promise<Menu> {
        const checkCode: Menu = await this.menuRepository.findOne({ where: { code: form.code } });
        if (checkCode) throw new BadRequestException('Code has been use');
        const parent: Menu = await this.menuRepository.findOne(form.parentMenu);
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
        const result: Menu = await this.menuRepository.findOne(id);
        if (!result) throw new NotFoundException(`Menu with id: ${id} Not Found`);
        try {
            return result;
        } catch (error) {
            throw new InternalServerErrorException('Internal Server Error');
        }
    }

    async getWithParent(id: number): Promise<Menu> {
        const result: Menu = await this.menuRepository.findOne({where: { id }, relations: ['parentMenu']});
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

    async createBulk(data: MenuDTO[]): Promise<Menu[]> {
        const menus: Menu[] = data.map((item: MenuDTO) => this.menuRepository.create(item));

        return await this.menuRepository.save(menus);
    }

    async findAllRelated(menu: Menu[]): Promise<Menu[]> {
        const menuIds: number[] = menu.map((item: Menu) => item.id);
        return await this.menuRepository.findByIds(menuIds);
    }
}
