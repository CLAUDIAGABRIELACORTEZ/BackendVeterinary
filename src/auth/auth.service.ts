import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthLoginInDto, UpdateHashDto } from "./dto/index";
import { BitacoraAccion, registrarEnBitacora } from "src/utils/index.utils";
import * as argon from 'argon2';


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, 
                private jwt: JwtService,
                private config: ConfigService) {}

    private async encontrarUsuario(email: string) {
        const cliente = await this.prisma.cliente.findUnique({ where: { Email: email } });
        const personal = await this.prisma.personal.findUnique({ where: { Email: email } });
        let usuario;
        if (cliente) {
            usuario = await this.prisma.usuario.findFirst({ where: { ClienteID: cliente.ClienteID, Estado: 'Activo' } });
        } else if (personal) {
            usuario = await this.prisma.usuario.findFirst({ where: { PersonalID: personal.PersonalID, Estado: 'Activo' } });
        }
        if (!usuario) {
            throw new ForbiddenException('El correo ingresado no tiene un usuario asociado.');
        }
        return usuario;
    }

    private async verificarHash(hashBD: string, hashDTO: string) {
        const hashMatch = await argon.verify(hashBD, hashDTO);
        if (!hashMatch) {
            throw new ForbiddenException('Contraseña incorrecta.');
        }
    }
    
    async login(dto: AuthLoginInDto, ipDir: string) {
        try {
            const usuario = await this.encontrarUsuario(dto.email);
            await this.verificarHash(usuario.PasswrdHash, dto.password);
            await registrarEnBitacora(this.prisma, usuario.UsuarioID, BitacoraAccion.Login, ipDir);
            return this.signToken(usuario.UsuarioID, usuario.Rol);
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    async logout(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.Logout, ipDir);
        return { 
            Respuesta: 'Cierre de sesión exitoso',
            UsuarioID: userId
        };
    }

    async updateHash(dto: UpdateHashDto) {
        try {
            return await this.prisma.$transaction(async (prisma) => {
                const usuario = await this.encontrarUsuario(dto.email);
                await this.verificarHash(usuario.PasswrdHash, dto.hashActual);
                const nuevoHash = await argon.hash(dto.hashNuevo);
                await prisma.usuario.update({
                    where: { UsuarioID: usuario.UsuarioID },
                    data: { PasswrdHash: nuevoHash }
                });
                return {
                    Respuesta: "Contraseña actualizada correctamente",
                    usuarioID: usuario.UsuarioID
                };
            });
        } catch (error) {
            console.error('Error en updateHash:', error);
            if (error instanceof ForbiddenException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error al actualizar la contraseña');
        }
    }
    
    private async signToken(usuarioId: number, rol: string): Promise<{access_token: string, rol: string}> {
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
