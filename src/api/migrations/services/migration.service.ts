import { IORedis } from 'redis';
import { RedisService } from 'nestjs-redis';
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
import {
  ProfileGender,
  ProfileReligion,
  ProfileMaritalStatus,
  AccountStatus,
  HttpMethod,
  ServiceType,
  AccountType,
} from '../../../config/constants';

@Injectable()
export default class MigrationService {
  private services: Service[] = [];
  private menus: Menu[] = [];
  private roles: { [key: string]: Role } = {};

  constructor(
    private readonly redisService: RedisService,
    private readonly service: ServicesService,
    private readonly menu: MenuService,
    private readonly role: RoleService,
    private readonly account: AccountService,
    private readonly profile: ProfileService,
    private readonly hash: HashUtil,
  ) {}

  async start(): Promise<void> {
    if (!this.migrated()) {
      await this.createDefaultServices();
      await this.createDefaultMenus();
      await this.createRoles();
      await this.createAccounts();
      await this.setMigrated();
    } else
      Logger.error(`Migration already done in ${process.env.NODE_ENV} environment.`, undefined, 'MigrationService@start', true);
  }

  private migrated(): boolean {
    const client: IORedis.Redis = this.redisService.getClient();
    return (client.exists('migrated') && client.get('migrated') === 'true');
  }

  private async setMigrated(): Promise<void> {
    const client: IORedis.Redis = this.redisService.getClient();

    client.set('migrated', (process.env.NODE_ENV === 'production'));
  }

  private async createDefaultServices(): Promise<void> {
    const data: ServiceDTO[] = [
      {
        code: 'AUTH_LOGIN',
        name: 'Login Service',
        endpointUrl: '/auth/login',
        method: HttpMethod.POST,
        serviceType: ServiceType.PUBLIC,
      },
      {
        code: 'AUTH_LOGOUT',
        name: 'Logout Service',
        endpointUrl: '/auth/logout',
        method: HttpMethod.DELETE,
        serviceType: ServiceType.PUBLIC,
      },
      {
        code: 'AUTH_PASSWORD_RESET',
        name: 'Password Reset Request',
        endpointUrl: '/auth/password/reset',
        method: HttpMethod.POST,
        serviceType: ServiceType.PUBLIC,
      },
      {
        code: 'AUTH_PASSWORD_UPDATE',
        name: 'Password Reset Update Service',
        endpointUrl: '/auth/password/reset',
        method: HttpMethod.PUT,
        serviceType: ServiceType.PUBLIC,
      },
      {
        code: 'CAND_AUTH_LOGIN',
        name: 'Candidate Login Service',
        endpointUrl: '/auth/candidate/login',
        method: HttpMethod.POST,
        serviceType: ServiceType.PUBLIC,
      },
      {
        code: 'CAND_AUTH_LOGOUT',
        name: 'Candidate Logout Service',
        endpointUrl: '/auth/candidate/logout',
        method: HttpMethod.DELETE,
        serviceType: ServiceType.PUBLIC,
      },
      {
        code: 'CAND_AUTH_PASSWORD_RESET',
        name: 'Candidate Password Reset Request',
        endpointUrl: '/auth/candidate/password/reset',
        method: HttpMethod.POST,
        serviceType: ServiceType.PUBLIC,
      },
      {
        code: 'CAND_AUTH_PASSWORD_UPDATE',
        name: 'Candidate Password Reset Update Service',
        endpointUrl: '/auth/candidate/password/reset',
        method: HttpMethod.PUT,
        serviceType: ServiceType.PUBLIC,
      },
      {
        code: 'CAND_CAPTCHA_REQUEST',
        name: 'New Candidate Registration Captcha Image Request',
        endpointUrl: '/auth/request',
        method: HttpMethod.GET,
        serviceType: ServiceType.PUBLIC,
      },
      {
        code: 'CAND_REGISTER',
        name: 'New Candidate Registration Service',
        endpointUrl: '/accounts/register',
        method: HttpMethod.POST,
        serviceType: ServiceType.PUBLIC,
      },
      {
        code: 'CAND_ACCOUNT_ACTIVATION',
        name: 'New Candidate Account Activation Service',
        endpointUrl: '/accounts/activation',
        method: HttpMethod.POST,
        serviceType: ServiceType.PUBLIC,
      },
      {
        code: 'CAND_PROFILE_UPDATE',
        name: 'Candidate Profile Update',
        endpointUrl: '/candidates',
        method: HttpMethod.PUT,
        serviceType: ServiceType.FRONTOFFICE,
      },
      {
        code: 'RES_DOCUMENT_UPLOAD',
        name: 'Candidate Document Upload',
        endpointUrl: '/documents/upload',
        method: HttpMethod.POST,
        serviceType: ServiceType.FRONTOFFICE,
      },
      {
        code: 'RES_DOCUMENT_DOWNLOAD',
        name: 'Candidate Document Download',
        endpointUrl: '/documents/download',
        method: HttpMethod.GET,
        serviceType: ServiceType.FRONTOFFICE,
      },
      {
        code: 'CAND_REGISTERED_LIST',
        name: 'Candidate Registered List',
        endpointUrl: '/candidates',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'CAND_DOCUMENT_LINK',
        name: 'Candidate Document Link',
        endpointUrl: '/candidates/documents',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_SERVICE_CREATE',
        name: 'Create Service',
        endpointUrl: '/services',
        method: HttpMethod.POST,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_SERVICE_UPDATE',
        name: 'Update Service',
        endpointUrl: '/services',
        method: HttpMethod.PUT,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_SERVICE_DELETE',
        name: 'Delete Service',
        endpointUrl: '/services',
        method: HttpMethod.DELETE,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_SERVICE_LIST',
        name: 'List All Services',
        endpointUrl: '/services',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_SERVICE_SEARCH',
        name: 'Search Services',
        endpointUrl: '/services/search',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_SERVICE_GET',
        name: 'Get Single Service',
        endpointUrl: '/services',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_MENU_CREATE',
        name: 'Create Menu',
        endpointUrl: '/menus',
        method: HttpMethod.POST,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_MENU_UPDATE',
        name: 'Update Menu',
        endpointUrl: '/menus',
        method: HttpMethod.PUT,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_MENU_DELETE',
        name: 'Delete Menu',
        endpointUrl: '/menus',
        method: HttpMethod.DELETE,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_MENU_LIST',
        name: 'List All Menus',
        endpointUrl: '/menus',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_MENU_SEARCH',
        name: 'Search Menus',
        endpointUrl: '/menus/search',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_MENU_GET',
        name: 'Get Single Menu',
        endpointUrl: '/menus',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ROLE_CREATE',
        name: 'Create Role',
        endpointUrl: '/roles',
        method: HttpMethod.POST,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ROLE_UPDATE',
        name: 'Update Role',
        endpointUrl: '/roles',
        method: HttpMethod.PUT,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ROLE_DELETE',
        name: 'Delete Role',
        endpointUrl: '/roles',
        method: HttpMethod.DELETE,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ROLE_LIST',
        name: 'List All Roles',
        endpointUrl: '/roles',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ROLE_SEARCH',
        name: 'Search Roles',
        endpointUrl: '/roles/search',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ROLE_GET',
        name: 'Get Single Role',
        endpointUrl: '/roles',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ACCOUNT_CREATE',
        name: 'Create Account',
        endpointUrl: '/accounts',
        method: HttpMethod.POST,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ACCOUNT_UPDATE',
        name: 'Update Account',
        endpointUrl: '/accounts',
        method: HttpMethod.PUT,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ACCOUNT_DELETE',
        name: 'Delete Account',
        endpointUrl: '/accounts',
        method: HttpMethod.DELETE,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ACCOUNT_LIST',
        name: 'List All Accounts',
        endpointUrl: '/accounts',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ACCOUNT_SEARCH',
        name: 'Search Accounts',
        endpointUrl: '/accounts/search',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ACCOUNT_GET',
        name: 'Get Account',
        endpointUrl: '/accounts',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ACCOUNT_PRIVILEGES',
        name: 'Get Account Privileges',
        endpointUrl: '/accounts/privileges',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MST_ACCOUNT_DEACTIVATE',
        name: 'Deactivate Account',
        endpointUrl: '/accounts',
        method: HttpMethod.PUT,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MESSAGES_LIST',
        name: 'Messages List',
        endpointUrl: '/messages',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MESSAGES_READ_UNREAD',
        name: 'Read/Unread Messages List',
        endpointUrl: '/messages',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MESSAGES_GET',
        name: 'Get Single Message',
        endpointUrl: '/messages',
        method: HttpMethod.GET,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MESSAGES_READ_UPDATE',
        name: 'Update Message Read Status',
        endpointUrl: '/messages',
        method: HttpMethod.PUT,
        serviceType: ServiceType.BACKOFFICE,
      },
      {
        code: 'MESSAGES_CREATE',
        name: 'Create New Message',
        endpointUrl: '/messages',
        method: HttpMethod.POST,
        serviceType: ServiceType.PORTAL,
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
         path: '/home',
         icon: 'home',
         order: 0,
      },
      {
        code: 'MESSAGES',
        name: 'Messages',
        path: '/messages',
        icon: 'inbox-outline',
        order: 1,
      },
      {
        code: 'CANDIDATE',
        name: 'Candidates',
        path: '/candidates',
        icon: 'people-outline',
        order: 2,
      },
      {
        code: 'MASTER',
        name: 'Master Data',
        path: '/master',
        icon: 'settings-2',
        order: 3,
      },
      {
        code: 'CANDIDATE_PROFILE',
        name: 'My Profile',
        path: '/my-profile',
        icon: 'person-outline',
        order: 4,
      },
      {
        code: 'CANDIDATE_RESUME',
        name: 'My Resume',
        path: '/my-resume',
        icon: 'file-text-outline',
        order: 5,
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
        path: '/master/accounts',
        order: 0,
        parentMenu: parents[ 'MASTER' ],
      },
      {
        code: 'MST_ROLES',
        name: 'Roles Management',
        path: '/master/roles',
        order: 1,
        parentMenu: parents['MASTER'],
      },
      {
        code: 'MST_MENUS',
        name: 'Menus Management',
        path: '/master/menus',
        order: 2,
        parentMenu: parents['MASTER'],
      },
      {
        code: 'MST_SERVICES',
        name: 'Services Management',
        path: '/master/services',
        order: 3,
        parentMenu: parents['MASTER'],
      },
      {
        code: 'CANDIDATE_REGISTERED',
        name: 'Candidate Registered',
        path: '/candidates/registered',
        order: 0,
        parentMenu: parents['CANDIDATE'],
      },
      {
        code: 'CANDIDATE_UPLOAD_CV',
        name: 'Upload Resume',
        path: '/my-resume/upload',
        order: 0,
        parentMenu: parents['CANDIDATE_RESUME'],
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
    try {
      const data: RoleDTO[] = [
        {
          code: 'ADMIN',
          name: 'Administrator',
          services: this.services.filter((service: Service) => ['CAND_PROFILE_UPDATE', 'RES_DOCUMENT_UPLOAD', 'RES_DOCUMENT_DOWNLOAD'].indexOf(service.code) < 0),
          menus: this.menus.filter((menu: Menu) => ['CANDIDATE_PROFILE', 'CANDIDATE_RESUME', 'CANDIDATE_UPLOAD_CV'].indexOf(menu.code) < 0),
        },
        {
          code: 'STAFF',
          name: 'Staff',
          services: [],
          menus: this.menus.filter((menu: Menu) => menu.code === 'HOME'),
        },
        {
          code: 'CANDIDATE',
          name: 'Candidate',
          services: this.services.filter((service: Service) => ['CAND_PROFILE_UPDATE', 'RES_DOCUMENT_UPLOAD', 'RES_DOCUMENT_DOWNLOAD', 'CAND_DOCUMENT_LINK'].indexOf(service.code) > -1),
          menus: this.menus.filter((menu: Menu) => ['HOME', 'CANDIDATE_PROFILE', 'CANDIDATE_RESUME', 'CANDIDATE_UPLOAD_CV'].indexOf(menu.code) > -1),
        },
        {
          code: 'TRAINEE',
          name: 'Trainee',
          services: [],
          menus: this.menus.filter((menu: Menu) => menu.code === 'HOME'),
        },
        {
          code: 'TRAINER',
          name: 'Trainer',
          services: [],
          menus: this.menus.filter((menu: Menu) => menu.code === 'HOME'),
        },
      ];

      Logger.log(`Creating ${data.length} roles...`);
      const roles: Role[] = await this.role.createBulk(data);

      roles.forEach((role: Role) => {
        Logger.log(`Role ${role.code} created.`);
        this.roles[ role.code ] = role;
      });
    } catch (exception) {
      console.error(exception);
      throw exception;
    }
  }

  private async createAccounts(): Promise<void> {
    Logger.log(`Creating new account..`);

    let profile: Profile = this.profile.repository().create({
      fullname: 'Administrator',
      nickname: 'Mimin',
      email: 'administrator@enigmacamp.com',
      phone: '-',
      gender: ProfileGender.MALE,
      religion: ProfileReligion.ISLAM,
      maritalStatus: ProfileMaritalStatus.SINGLE,
      birthdate: new Date(2000, 1, 1, 0, 0, 0, 0),
    });

    let account: Account = this.account.repository().create({
      username: 'admin',
      password: await this.hash.create('P@ssw0rd'),
      status: AccountStatus.ACTIVE,
      accountType: AccountType.ADMINISTRATOR,
      profile,
    });

    account = await this.account.save(account);
    account.roles = Promise.resolve([ this.roles['ADMIN'] ]);

    await this.account.save(account);

    Logger.log(`Account ${account.username} created.`);

    profile = this.profile.repository().create({
      fullname: 'Staff Backoffice',
      nickname: 'Staff 1',
      email: 'staff1@enigmacamp.com',
      phone: '-',
      gender: ProfileGender.FEMALE,
      religion: ProfileReligion.ISLAM,
      maritalStatus: ProfileMaritalStatus.SINGLE,
      birthdate: new Date(2000, 1, 1, 0, 0, 0, 0),
    });

    account = this.account.repository().create({
      username: 'staff1',
      password: await this.hash.create('P@ssw0rd'),
      status: AccountStatus.ACTIVE,
      accountType: AccountType.STAFF,
      profile,
    });

    account = await this.account.save(account);
    account.roles = Promise.resolve([ this.roles['STAFF'] ]);

    await this.account.save(account);

    Logger.log(`Account ${account.username} created.`);

    if (process.env.NODE_ENV === 'local') {
      profile = this.profile.repository().create({
        fullname: 'Candidate One',
        nickname: 'canone',
        email: 'candidate1@candidates.com',
        phone: '-',
        gender: ProfileGender.FEMALE,
        religion: ProfileReligion.ISLAM,
        maritalStatus: ProfileMaritalStatus.SINGLE,
        birthdate: new Date(2000, 1, 1, 0, 0, 0, 0),
      });

      account = this.account.repository().create({
        username: 'candidate1@candidates.com',
        password: await this.hash.create('P@ssw0rd'),
        status: AccountStatus.ACTIVE,
        accountType: AccountType.CANDIDATE,
        profile,
      });

      account = await this.account.save(account);
      account.roles = Promise.resolve([ this.roles['CANDIDATE'] ]);

      await this.account.save(account);

      Logger.log(`Account ${account.username} created.`);

      profile = this.profile.repository().create({
        fullname: 'Candidate Two',
        nickname: 'cantwo',
        email: 'candidate2@candidates.com',
        phone: '-',
        gender: ProfileGender.MALE,
        religion: ProfileReligion.ISLAM,
        maritalStatus: ProfileMaritalStatus.SINGLE,
        birthdate: new Date(2001, 1, 1, 0, 0, 0, 0),
      });

      account = this.account.repository().create({
        username: 'candidate2@candidates.com',
        password: await this.hash.create('P@ssw0rd'),
        status: AccountStatus.ACTIVE,
        accountType: AccountType.CANDIDATE,
        profile,
      });

      account = await this.account.save(account);
      account.roles = Promise.resolve([ this.roles['CANDIDATE'] ]);

      await this.account.save(account);

      Logger.log(`Account ${account.username} created.`);

      profile = this.profile.repository().create({
        fullname: 'Candidate Three',
        nickname: 'canthree',
        email: 'candidate3@candidates.com',
        phone: '-',
        gender: ProfileGender.MALE,
        religion: ProfileReligion.ISLAM,
        maritalStatus: ProfileMaritalStatus.SINGLE,
        birthdate: new Date(2002, 1, 1, 0, 0, 0, 0),
      });

      account = this.account.repository().create({
        username: 'candidate3@candidates.com',
        password: await this.hash.create('P@ssw0rd'),
        status: AccountStatus.ACTIVE,
        accountType: AccountType.CANDIDATE,
        profile,
      });

      account = await this.account.save(account);
      account.roles = Promise.resolve([ this.roles['CANDIDATE'] ]);

      await this.account.save(account);

      Logger.log(`Account ${account.username} created.`);

      profile = this.profile.repository().create({
        fullname: 'Candidate Four',
        nickname: 'canfour',
        email: 'candidate4@candidates.com',
        phone: '-',
        gender: ProfileGender.MALE,
        religion: ProfileReligion.ISLAM,
        maritalStatus: ProfileMaritalStatus.SINGLE,
        birthdate: new Date(2003, 1, 1, 0, 0, 0, 0),
      });

      account = this.account.repository().create({
        username: 'candidate4@candidates.com',
        password: await this.hash.create('P@ssw0rd'),
        status: AccountStatus.ACTIVE,
        accountType: AccountType.CANDIDATE,
        profile,
      });

      account = await this.account.save(account);
      account.roles = Promise.resolve([ this.roles['CANDIDATE'] ]);

      await this.account.save(account);

      Logger.log(`Account ${account.username} created.`);

      profile = this.profile.repository().create({
        fullname: 'Candidate Five',
        nickname: 'canfive',
        email: 'candidate5@candidates.com',
        phone: '-',
        gender: ProfileGender.MALE,
        religion: ProfileReligion.ISLAM,
        maritalStatus: ProfileMaritalStatus.SINGLE,
        birthdate: new Date(2004, 1, 1, 0, 0, 0, 0),
      });

      account = this.account.repository().create({
        username: 'candidate5@candidates.com',
        password: await this.hash.create('P@ssw0rd'),
        status: AccountStatus.ACTIVE,
        accountType: AccountType.CANDIDATE,
        profile,
      });

      account = await this.account.save(account);
      account.roles = Promise.resolve([ this.roles['CANDIDATE'] ]);

      await this.account.save(account);

      Logger.log(`Account ${account.username} created.`);

      profile = this.profile.repository().create({
        fullname: 'Candidate Six',
        nickname: 'cansix',
        email: 'candidate6@candidates.com',
        phone: '-',
        gender: ProfileGender.MALE,
        religion: ProfileReligion.ISLAM,
        maritalStatus: ProfileMaritalStatus.SINGLE,
        birthdate: new Date(2005, 1, 1, 0, 0, 0, 0),
      });

      account = this.account.repository().create({
        username: 'candidate6@candidates.com',
        password: await this.hash.create('P@ssw0rd'),
        status: AccountStatus.ACTIVE,
        accountType: AccountType.CANDIDATE,
        profile,
      });

      account = await this.account.save(account);
      account.roles = Promise.resolve([ this.roles['CANDIDATE'] ]);

      await this.account.save(account);

      Logger.log(`Account ${account.username} created.`);
    }
  }
}
