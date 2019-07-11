import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CookieAuthGuard extends AuthGuard('cookie') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    Logger.log(context.switchToHttp().getRequest());
    return super.canActivate(context);
  }

  handleRequest(err, account, info) {
    if (err || !account) throw err || new UnauthorizedException();
    return account;
  }
}
