import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, SelectQueryBuilder } from 'typeorm';
import { MenuDTO, MenuQueryDTO, MenuQueryResult } from '../models/menu.dto';
import Menu from '../models/menu.entity';
import Role from '../../roles/models/role.entity';

@Injectable()
export default class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) { }

  async all(queryParams: MenuQueryDTO): Promise<MenuQueryResult> {
    const offset: number = queryParams.page > 1 ? (queryParams.rowsPerPage * (queryParams.page - 1)) : 0;
    let query: SelectQueryBuilder<Menu> = this.menuRepository.createQueryBuilder('m');

    if (queryParams.term) {
      let { term } = queryParams;
      term = `%${term}%`;
      query = query
        .orWhere('m.code LIKE :term', { term })
        .orWhere('m.name LIKE :term', { term })
        .orWhere('m.order LIKE :term', { term })
        .orWhere('m.icon LIKE :term', { term });
    }

    if (queryParams.order && queryParams.sort) {
      const sort: 'ASC' | 'DESC' = queryParams.sort.toUpperCase() as 'ASC' | 'DESC';
      const orderCols: { [key: string]: string } = {
        code: 'm.code',
        name: 'm.name',
      };
      query = query.orderBy(orderCols[queryParams.order], sort);
    } else
      query = query.orderBy('m.name', 'ASC');

    query.offset(offset);
    query.limit(1000);

    const result: [Menu[], number] = await query.getManyAndCount();

    return {
      result: result[0],
      totalRows: result[1],
    };
  }

  async add(form: MenuDTO): Promise<Menu> {
    const checkCode: Menu = await this.menuRepository.findOne({ where: { code: form.code } });
    if (checkCode) throw new BadRequestException('Code has been use.');
    const parent: Menu = await this.menuRepository.findOne({ where: { id: form.parentMenu.id } });

    const menu: Menu = new Menu();
    menu.code = form.code;
    menu.name = form.name;
    menu.order = form.order;
    menu.icon = form.icon;
    menu.parentMenu = parent;

    return await this.menuRepository.save(menu);
  }

  async get(id: number): Promise<Menu> {
    return await this.menuRepository.findOne({ where: { id }, relations: ['parentMenu'] });
  }

  async getRelations(id: number): Promise<Menu> {
    return await this.menuRepository.findOne({ where: { id }, relations: ['childrenMenu'] });
  }

  async getWithParent(id: number): Promise<Menu> {
    const result: Menu = await this.menuRepository.findOne({ where: { id }, relations: ['parentMenu'] });
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

  async findRelations(id: number): Promise<Menu> {
    return await this.menuRepository.findOne({ where: { id }, relations: ['roles', 'childrenMenu', 'parentMenu'] });
  }

  async delete(id: number): Promise<DeleteResult> {
    const menu: Menu = await this.get(id);

    if (!menu) throw new NotFoundException(`Menu with ID ${id} cannot be found.`);

    const roles: Role[] = await menu.roles;
    const children: Menu[] = await menu.childrenMenu;

    if (roles.length > 0 || children.length > 0)
      throw new UnprocessableEntityException(`Unable to delete menu, this menu is being used by ${roles.length} role(s) and parent of ${children.length} submenu(s).`);

    return await this.menuRepository.delete(id);
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
