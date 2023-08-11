import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/auth/domain/interfaces/valid-roles';
// import { ValidRoles } from 'src/auth/domain/interfaces';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) => {
    return SetMetadata(META_ROLES, args)
};
