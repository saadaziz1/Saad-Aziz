import {
    Injectable,
    CanActivate,
    ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

/**
 * Guard = gatekeeper for routes
 */
@Injectable()
export class RolesGuard implements CanActivate {

    /**
     * Reflector allows reading metadata
     */
    constructor(private reflector: Reflector) { }

    /**
     * This method runs BEFORE controller method
     */
    canActivate(context: ExecutionContext): boolean {

        /**
         * Read roles metadata from handler
         */
        const requiredRoles = this.reflector.get<Role[]>(
            'roles',
            context.getHandler(),
        );

        /**
         * If route has no @Roles decorator
         * allow access
         */
        if (!requiredRoles) {
            return true;
        }

        /**
         * Get HTTP request object
         */
        const request = context.switchToHttp().getRequest();

        /**
         * req.user is injected by JwtStrategy
         */
        const user = request.user;

        /**
         * Check if user's role is allowed
         * Support Hierarchy: SUPER_ADMIN > ADMIN > USER
         */
        if (user.role === Role.SUPER_ADMIN) return true;
        if (user.role === Role.ADMIN && !requiredRoles.includes(Role.SUPER_ADMIN)) return true;

        return requiredRoles.includes(user.role);
    }
}
