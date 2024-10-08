import { ForbiddenException, Injectable, Request } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthLoginInDto } from "./dto";
import * as argon from 'argon2';



@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, 
                private jwt: JwtService,
                private config: ConfigService) {}

    async login(dto: AuthLoginInDto) {
        try {
            const cliente = await this.prisma.cliente.findUnique({
                where: { Email: dto.email }
            });
            const personal = await this.prisma.personal.findUnique({
                where: { Email: dto.email }
            });
    
            let usuario;
            if (cliente) {
                usuario = await this.prisma.usuario.findFirst({
                    where: { ClienteID: cliente.ClienteID }
                });
            } else if (personal) {
                usuario = await this.prisma.usuario.findFirst({
                    where: { PersonalID: personal.PersonalID }
                });
            }
    
            if (!usuario) {
                throw new ForbiddenException('El correo ingresado no tiene un usuario asociado.');
            }

            const hashMatch = await argon.verify(usuario.PasswrdHash, dto.password);
            if (!hashMatch) {
                throw new ForbiddenException('Contraseña incorrecta.');
            }
    
            await this.prisma.bitacora.create({
                data: {
                    TipoAccionBitacoraID: 1,
                    UsuarioID: usuario.UsuarioID,
                    FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
                }
            });
    
            return this.signToken(usuario.UsuarioID, usuario.Rol);
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    async logout(@Request() req) {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = this.jwt.decode(token);
        
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: decodedToken.sub,
                TipoAccionBitacoraID: 2,
                FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
            }
        });
    
        return { message: 'Logout exitoso',
            UsuarioID: decodedToken.sub
        };
    }

    async signToken(usuarioId: number, rol: string): Promise<{access_token: string, rol: string}> {
        const payload = {
            sub: usuarioId,
            rol
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '60m',
            secret: secret,
        });
        return {
            access_token: token,
            rol: rol
        };
    }
}
