import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

/**
 * Custom decorator
 * Adds metadata to route handlers
 */
export const Roles = (...roles: Role[]) =>
    SetMetadata('roles', roles);
