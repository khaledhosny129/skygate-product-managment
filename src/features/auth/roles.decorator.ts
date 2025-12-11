import { SetMetadata } from '@nestjs/common';

import { RoleEnum } from '@features/users/enums/role.enum';

export const Roles = (...roles: RoleEnum[]) => SetMetadata('roles', roles);
