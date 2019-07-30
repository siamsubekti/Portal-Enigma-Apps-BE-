import { Injectable, Logger } from '@nestjs/common';
import ServicesService from '../../master/services/services/services.service';
import MenuService from '../../master/menus/services/menu.service';
import RoleService from '../../master/roles/services/role.service';

import Service from '../../master/services/models/service.entity';
import Menu from '../../master/menus/models/menu.entity';
import Role from '../../master/roles/models/role.entity';

import { ServiceDTO } from '../../master/services/models/service.dto';
import { MenuDTO } from '../../master/menus/models/menu.dto';
import { RoleDTO } from '../../master/roles/models/role.dto';

@Injectable()
export default class MigrationService {
  private services: Service[] = [];
  private menus: Menu[] = [];

  constructor(
    private readonly service: ServicesService,
    private readonly menu: MenuService,
    private readonly role: RoleService,
  ) {}

  async start(): Promise<void> {
    await this.createDefaultServices();
    await this.createDefaultMenus();
    await this.createRoles();
  }

  private async createDefaultServices(): Promise<void> {
    const data: ServiceDTO[] = [
      {
        code: 'MST_SERVICE_CREATE',
        name: 'Create Service',
        endpointUrl: '/services',
        method: 'POST',
      },
      {
        code: 'MST_SERVICE_UPDATE',
        name: 'Update Service',
        endpointUrl: '/services',
        method: 'PUT',
      },
      {
        code: 'MST_SERVICE_DELETE',
        name: 'Delete Service',
        endpointUrl: '/services',
        method: 'DELETE',
      },
      {
        code: 'MST_SERVICE_LIST',
        name: 'List All Services',
        endpointUrl: '/services',
        method: 'GET',
      },
      {
        code: 'MST_SERVICE_GET',
        name: 'Get Single Service',
        endpointUrl: '/services',
        method: 'GET',
      },
      {
        code: 'MST_MENU_CREATE',
        name: 'Create Menu',
        endpointUrl: '/menus',
        method: 'POST',
      },
      {
        code: 'MST_MENU_UPDATE',
        name: 'Update Menu',
        endpointUrl: '/menus',
        method: 'PUT',
      },
      {
        code: 'MST_MENU_DELETE',
        name: 'Delete Menu',
        endpointUrl: '/menus',
        method: 'DELETE',
      },
      {
        code: 'MST_MENU_LIST',
        name: 'List All Menus',
        endpointUrl: '/menus',
        method: 'GET',
      },
      {
        code: 'MST_MENU_GET',
        name: 'Get Single Menu',
        endpointUrl: '/menus',
        method: 'GET',
      },
      {
        code: 'MST_ROLE_CREATE',
        name: 'Create Role',
        endpointUrl: '/roles',
        method: 'POST',
      },
      {
        code: 'MST_ROLE_UPDATE',
        name: 'Update Role',
        endpointUrl: '/roles',
        method: 'PUT',
      },
      {
        code: 'MST_ROLE_DELETE',
        name: 'Delete Role',
        endpointUrl: '/roles',
        method: 'DELETE',
      },
      {
        code: 'MST_ROLE_LIST',
        name: 'List All Roles',
        endpointUrl: '/roles',
        method: 'GET',
      },
      {
        code: 'MST_ROLE_GET',
        name: 'Get Single Role',
        endpointUrl: '/roles',
        method: 'GET',
      },
      {
        code: 'MST_ACCOUNT_CREATE',
        name: 'Create Account',
        endpointUrl: '/accounts',
        method: 'POST',
      },
      {
        code: 'MST_ACCOUNT_UPDATE',
        name: 'Update Account',
        endpointUrl: '/accounts',
        method: 'PUT',
      },
      {
        code: 'MST_ACCOUNT_DELETE',
        name: 'Delete Account',
        endpointUrl: '/accounts',
        method: 'DELETE',
      },
      {
        code: 'MST_ACCOUNT_LIST',
        name: 'List All Accounts',
        endpointUrl: '/accounts',
        method: 'GET',
      },
      {
        code: 'MST_ACCOUNT_GET',
        name: 'Get Account',
        endpointUrl: '/accounts',
        method: 'GET',
      },
      {
        code: 'MST_ACCOUNT_PRIVILEGES',
        name: 'Get Account Privileges',
        endpointUrl: '/accounts',
        method: 'GET',
      },
    ];

    Logger.log(`Creating ${data.length} services...`);
    const services: Service[] = await this.service.createBulk(data);

    services.map((service: Service) => { Logger.log(`${service.code} created.`); });
    this.services = services;
  }

  private async createDefaultMenus(): Promise<void> {
    let data: MenuDTO[] = [
      {
         code: 'HOME',
         name: 'Home',
         icon: 'fa-home',
         order: 0,
      },
      {
        code: 'CANDIDATE',
        name: 'Candidate Menu',
        icon: 'fa-user',
        order: 1,
      },
      {
        code: 'HC',
        name: 'Human Capital Menu',
        icon: 'fa-user',
        order: 2,
      },
      {
        code: 'STAFF',
        name: 'Staff Menu',
        icon: 'fa-user',
        order: 3,
      },
      {
        code: 'MASTER',
        name: 'Master Data',
        icon: 'fa-database',
        order: 4,
      },
    ];

    Logger.log(`Creating ${data.length} parents menu...`);
    let menus: Menu[] = await this.menu.createBulk(data);
    const parents: { [key: string]: Menu} = {};

    menus.map((menu: Menu) => {
      Logger.log(`Menu ${menu.code} created.`);
      this.menus.push(menu);
      parents[ menu.code ] = menu;
    });

    data = [
      {
        code: 'MST_ACCOUNTS',
        name: 'Accounts Management',
        icon: 'fa-groups',
        order: 0,
        parentMenu: parents[ 'MASTER' ],
      },
      {
        code: 'MST_ROLES',
        name: 'Roles Management',
        icon: 'fa-empty',
        order: 1,
        parentMenu: parents['MASTER'],
      },
      {
        code: 'MST_MENUS',
        name: 'Menus Management',
        icon: 'fa-empty',
        order: 2,
        parentMenu: parents['MASTER'],
      },
      {
        code: 'MST_SERVICES',
        name: 'Services Management',
        icon: 'fa-empty',
        order: 3,
        parentMenu: parents['MASTER'],
      },
    ];

    Logger.log(`Creating ${data.length} children menu...`);
    menus = await this.menu.createBulk(data);

    menus.map((menu: Menu) => {
      Logger.log(`Menu ${menu.code} created.`);
      this.menus.push(menu);
    });
  }

  private async createRoles(): Promise<void> {
    const data: RoleDTO[] = [
      {
        code: 'SUDO',
        name: 'Superuser',
        services: this.services,
        menus: this.menus,
      },
      {
        code: 'ADMIN',
        name: 'Administrator',
        services: this.services,
        menus: this.menus,
      },
    ];

    Logger.log(`Creating ${data.length} roles...`);
    const roles: Role[] = await this.role.createBulk(data);

    roles.forEach((role: Role) => Logger.log(`Role ${role.code} created.`));
  }
}
