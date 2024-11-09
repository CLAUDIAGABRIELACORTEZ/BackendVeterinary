import { JwtService } from "@nestjs/jwt";
import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";


export const GetUsuario = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
);

export enum Role {
    ADMIN = 'Administrador',
    VETDOC = 'Veterinario',
    CLIENT = 'Cliente'
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

export const Usuario = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('No se encontró el token.');
        }
        const jwtService = new JwtService({ secret: process.env.JWT_SECRET });
        const decoded = jwtService.verify(token);
        
        // Obtener la IP
        const ip = request.ip || request.connection.remoteAddress;
        
        return { userId: decoded.sub, ip };
    },
);
