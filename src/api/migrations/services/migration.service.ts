import { Injectable, Logger } from '@nestjs/common';
import HashUtil from '../../../libraries/utilities/hash.util';
import ServicesService from '../../master/services/services/services.service';
import MenuService from '../../master/menus/services/menu.service';
import RoleService from '../../master/roles/services/role.service';
import ProfileService from '../../accounts/services/profile.service';
import AccountService from '../../accounts/services/account.service';

import Service from '../../master/services/models/service.entity';
import Menu from '../../master/menus/models/menu.entity';
import Role from '../../master/roles/models/role.entity';
import Account from '../../accounts/models/account.entity';
import Profile from '../../accounts/models/profile.entity';

import { ServiceDTO } from '../../master/services/models/service.dto';
import { MenuDTO } from '../../master/menus/models/menu.dto';
import { RoleDTO } from '../../master/roles/models/role.dto';
import { ProfileGender, ProfileReligion, ProfileMaritalStatus, AccountStatus, HttpMethod } from '../../../config/constants';

@Injectable()
export default class MigrationService {
  private services: Service[] = [];
  private menus: Menu[] = [];
  private roles: { [key: string]: Role } = {};

  constructor(
    private readonly service: ServicesService,
    private readonly menu: MenuService,
    private readonly role: RoleService,
    private readonly account: AccountService,
    private readonly profile: ProfileService,
    private readonly hash: HashUtil,
  ) {}

  async start(): Promise<void> {
    await this.createDefaultServices();
    await this.createDefaultMenus();
    await this.createRoles();
    await this.createAccount();
  }

  private async createDefaultServices(): Promise<void> {
    const data: ServiceDTO[] = [
      {
        code: 'MST_SERVICE_CREATE',
        name: 'Create Service',
        endpointUrl: '/services',
        method: HttpMethod.POST,
      },
      {
        code: 'MST_SERVICE_UPDATE',
        name: 'Update Service',
        endpointUrl: '/services',
        method: HttpMethod.PUT,
      },
      {
        code: 'MST_SERVICE_DELETE',
        name: 'Delete Service',
        endpointUrl: '/services',
        method: HttpMethod.DELETE,
      },
      {
        code: 'MST_SERVICE_LIST',
        name: 'List All Services',
        endpointUrl: '/services',
        method: HttpMethod.GET,
      },
      {
        code: 'MST_SERVICE_GET',
        name: 'Get Single Service',
        endpointUrl: '/services',
        method: HttpMethod.GET,
      },
      {
        code: 'MST_MENU_CREATE',
        name: 'Create Menu',
        endpointUrl: '/menus',
        method: HttpMethod.POST,
      },
      {
        code: 'MST_MENU_UPDATE',
        name: 'Update Menu',
        endpointUrl: '/menus',
        method: HttpMethod.PUT,
      },
      {
        code: 'MST_MENU_DELETE',
        name: 'Delete Menu',
        endpointUrl: '/menus',
        method: HttpMethod.DELETE,
      },
      {
        code: 'MST_MENU_LIST',
        name: 'List All Menus',
        endpointUrl: '/menus',
        method: HttpMethod.GET,
      },
      {
        code: 'MST_MENU_GET',
        name: 'Get Single Menu',
        endpointUrl: '/menus',
        method: HttpMethod.GET,
      },
      {
        code: 'MST_ROLE_CREATE',
        name: 'Create Role',
        endpointUrl: '/roles',
        method: HttpMethod.POST,
      },
      {
        code: 'MST_ROLE_UPDATE',
        name: 'Update Role',
        endpointUrl: '/roles',
        method: HttpMethod.PUT,
      },
      {
        code: 'MST_ROLE_DELETE',
        name: 'Delete Role',
        endpointUrl: '/roles',
        method: HttpMethod.DELETE,
      },
      {
        code: 'MST_ROLE_LIST',
        name: 'List All Roles',
        endpointUrl: '/roles',
        method: HttpMethod.GET,
      },
      {
        code: 'MST_ROLE_GET',
        name: 'Get Single Role',
        endpointUrl: '/roles',
        method: HttpMethod.GET,
      },
      {
        code: 'MST_ACCOUNT_CREATE',
        name: 'Create Account',
        endpointUrl: '/accounts',
        method: HttpMethod.POST,
      },
      {
        code: 'MST_ACCOUNT_UPDATE',
        name: 'Update Account',
        endpointUrl: '/accounts',
        method: HttpMethod.PUT,
      },
      {
        code: 'MST_ACCOUNT_DELETE',
        name: 'Delete Account',
        endpointUrl: '/accounts',
        method: HttpMethod.DELETE,
      },
      {
        code: 'MST_ACCOUNT_LIST',
        name: 'List All Accounts',
        endpointUrl: '/accounts',
        method: HttpMethod.GET,
      },
      {
        code: 'MST_ACCOUNT_GET',
        name: 'Get Account',
        endpointUrl: '/accounts',
        method: HttpMethod.GET,
      },
      {
        code: 'MST_ACCOUNT_PRIVILEGES',
        name: 'Get Account Privileges',
        endpointUrl: '/accounts',
        method: HttpMethod.GET,
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
      {
        code: 'CANDIDATE',
        name: 'Candidate',
        services: [],
        menus: this.menus.filter((menu: Menu) => ['HOME', 'CANDIDATE'].indexOf(menu.code) >= 0),
      },
    ];

    Logger.log(`Creating ${data.length} roles...`);
    const roles: Role[] = await this.role.createBulk(data);

    roles.forEach((role: Role) => {
      Logger.log(`Role ${role.code} created.`);
      this.roles[ role.code ] = role;
    });
  }

  private async createAccount(): Promise<void> {
    Logger.log(`Creating new account..`);

    const profile: Profile = this.profile.repository().create({
      fullname: 'Adisthya Rahmadyan',
      nickname: 'Adis',
      email: 'adisthya.rahmadyan@sqrtechno.com',
      phone: '087887202505',
      gender: ProfileGender.MALE,
      religion: ProfileReligion.ISLAM,
      maritalStatus: ProfileMaritalStatus.MARRIED,
      birthdate: new Date(1986, 3, 16, 0, 0, 0, 0),
    });

    let account: Account = this.account.repository().create({
      username: profile.email,
      password: await this.hash.create('P@ssw0rd'),
      status: AccountStatus.ACTIVE,
      profile,
    });

    account = await this.account.save(account);
    account.roles = Promise.resolve([ this.roles['SUDO'] ]);

    await this.account.save(account);

    Logger.log(`Account ${account.username} created.`);
  }
}
