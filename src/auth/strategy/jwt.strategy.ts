import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { usuario_Rol } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET')
        })
    }

    async validate(payload: {sub: number, rol: string}) {
        const usuario = await this.prisma.usuario.findUnique({
            where: {
                UsuarioID: payload.sub,
            }
        });
        if (!usuario) {
            throw new UnauthorizedException('Usuario no encontrado');
        }
        return {
            id: usuario.UsuarioID,
            // email: usuario.email,
            rol: usuario.Rol // Asegúrate de incluir el rol
        };
    }
}
