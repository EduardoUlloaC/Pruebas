import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// import { UserRoleGuard } from '../../auth/application/guards/user-role/user-role.guard';
// import { ValidRoles } from 'src/auth/domain/interfaces';
import { RoleProtected } from './role-protected.decorator';
import { ValidRoles } from 'src/auth/domain/interfaces/valid-roles';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';

export function Auth(...roles: ValidRoles[]) {

  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard)
    // ApiBearerAuth(),
    // ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
