import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import Role from 'src/api/master/roles/models/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        ) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        console.log(roles);
        if (!roles) {
          return true;
        }
        const request = context.switchToHttp().getRequest();
        const account = request.user;
        console.log('role',account.roles);
        const hasRole = account.roles.find(() => roles);
        console.log(hasRole);
        return account && account.roles && hasRole;
    }
}
