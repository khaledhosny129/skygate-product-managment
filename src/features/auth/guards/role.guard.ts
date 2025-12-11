import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { RoleEnum } from '@features/users/enums/role.enum';
import { ForbiddenException } from '@core/exceptions';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      'roles',
      [context.getHandler(), context.getClass()]
    );

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!requiredRoles.includes(user.role)) {
      const roleNames = requiredRoles.map(role => role.charAt(0) + role.slice(1).toLowerCase()).join(' or ');
      throw new ForbiddenException(
        'You do not have permission to perform this action',
        {
          code: 'FORBIDDEN',
          details: `${roleNames} role required for this operation`
        }
      );
    }

    return true;
  }
}
