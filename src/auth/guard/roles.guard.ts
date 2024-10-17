import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../decorator';



@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return false; // Si no hay roles definidos, no se permite el acceso
        }

        const { user } = context.switchToHttp().getRequest();
        
        if (!user || !user.rol) {
            return false; // Si no hay usuario o el usuario no tiene rol, denegar el acceso
        }

        return requiredRoles.includes(user.rol);
    }
}
