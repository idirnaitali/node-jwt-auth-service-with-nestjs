import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new InternalServerErrorException();
    }

    return this.matchRoles(roles, request.user.roles);
  }

  private matchRoles(roles: string[], userRoles: string[]) {
    return roles.some(r => userRoles.find(ur => ur === r));
  }
}
