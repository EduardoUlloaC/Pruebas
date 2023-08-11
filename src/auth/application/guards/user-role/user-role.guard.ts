import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { User } from 'src/auth/infraestructure/entities/user.entity';
import { META_ROLES } from 'src/auth/application/decorators/role-protected.decorator';
// import { META_ROLES } from '../../../../common/decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
    ) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const validRole: string[] = this.reflector.get(META_ROLES, context.getHandler());
        
        if (!validRole) return true;
        if (validRole.length === 0) return true;
        
        const req = context.switchToHttp().getRequest();
        // console.log(req);
        const user = req.user as User;

        if (!user)
            new BadRequestException('User not found');

        // console.log({ userRole: user.roles });

        for (const role of user.roles) {
            if (validRole.includes(role)) {
                return true;
            }
        }
        throw new ForbiddenException(
            `User ${user.fullName} need a valid role: [${validRole}]`
        )
    }
}
