import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthLoginInDto, UpdateHashDto } from "./dto";
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

    async logout(userId: number) {
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: userId,
                TipoAccionBitacoraID: 2,
                FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
            }
        });
    
        return { message: 'Cierre de sesión exitoso',
            UsuarioID: userId
        };
    }

    async updateHash(dto: UpdateHashDto) {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const cliente = await prisma.cliente.findUnique({
                    where: { Email: dto.email }
                });
                const personal = await prisma.personal.findUnique({
                    where: { Email: dto.email }
                });
    
                let usuario;
                if (cliente) {
                    usuario = await prisma.usuario.findFirst({
                        where: { ClienteID: cliente.ClienteID }
                    });
                } else if (personal) {
                    usuario = await prisma.usuario.findFirst({
                        where: { PersonalID: personal.PersonalID }
                    });
                }
    
                if (!usuario) {
                    throw new ForbiddenException('El correo ingresado no tiene un usuario asociado.');
                }
    
                const hashMatch = await argon.verify(usuario.PasswrdHash, dto.hashActual);
                if (!hashMatch) {
                    throw new ForbiddenException('Contraseña actual incorrecta');
                }
    
                const nuevoHash = await argon.hash(dto.hashNuevo);
    
                await prisma.usuario.update({
                    where: {
                        UsuarioID: usuario.UsuarioID
                    },
                    data: {
                        PasswrdHash: nuevoHash
                    }
                });
    
                return {
                    message: "Contraseña actualizada correctamente",
                    usuarioID: usuario.UsuarioID
                };
            });
    
            return result;
        } catch (error) {
            console.error('Error en updateHash:', error);
            if (error instanceof ForbiddenException || error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException('Error al actualizar la contraseña');
        }
    }

    // async updateHash(dto: UpdateHashDto) {
    //     try {
    //         const decodedToken = this.jwt.decode(dto.JWT);
    //         const usuario = await this.prisma.usuario.findUnique({
    //             where: {
    //                 UsuarioID: decodedToken.sub
    //             }
    //         });
          
    //         if (!usuario) {
    //             throw new NotFoundException('Usuario no encontrado');
    //         }
          
    //         const hashMatch = await argon.verify(usuario.PasswrdHash, dto.hashActual);
    //         if (!hashMatch) {
    //             throw new ForbiddenException('Contraseña actual incorrecta');
    //         }
          
    //         const nuevoHash = await argon.hash(dto.hashNuevo);
    //         await this.prisma.usuario.update({
    //             where: {
    //                 UsuarioID: decodedToken.sub
    //             },
    //             data: {
    //                 PasswrdHash: nuevoHash
    //             }
    //         });
          
    //         return {
    //             message: "Contraseña actualizada correctamente",
    //             usuarioID: decodedToken.sub
    //         };
    //     } catch (error) {
    //         console.error('Error en updateHash:', error);
    //         if (error instanceof ForbiddenException || error instanceof NotFoundException) {
    //             throw error;
    //         }
    //         throw new InternalServerErrorException('Error al actualizar la contraseña');
    //     }
    // }
    
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
