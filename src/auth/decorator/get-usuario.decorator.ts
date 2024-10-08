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

