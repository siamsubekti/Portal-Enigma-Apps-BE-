import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export default class CookieAuthGuard extends AuthGuard('cookie') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    // Logger.log(context.switchToHttp().getRequest());
    return super.canActivate(context);
  }

  handleRequest(err: any, account: any, info: any): any {
    if (err || !account) throw err || new UnauthorizedException('Unauthorized access.');
    return account;
  }
}
