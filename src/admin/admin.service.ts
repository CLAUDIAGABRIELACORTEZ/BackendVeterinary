import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClienteDto } from './dto/createCliente.dto';
import { CreateMascotaDto, CreatePersonalDto, GetPersonalDto, GetQueryDto, UpdateClienteDto, UpdateMascotaDto } from './dto';
import { usuario_Rol } from '@prisma/client';
import * as argon from 'argon2';
import { UpdatePersonalDto } from './dto/updatePersonal.dto';



@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService, 
                private jwt: JwtService,
                private config: ConfigService) {}

    async crearCliente(dto: CreateClienteDto) {
        const clienteRepetido = await this.prisma.cliente.findUnique({
            where: {
                Email: dto.Email,
            }
        });
        if (clienteRepetido) {
            throw new ForbiddenException('El correo ingresado ya existe en base de datos.');
        }
        const cliente = await this.prisma.cliente.create({
            data: {
                NombreCompleto: dto.NombreCompleto,
                Telefono: dto.Telefono,
                Direccion: dto.Direccion,
                Email: dto.Email
            }
        });
        const hashUsuario = await argon.hash('clientenuevo');
        const usuario = await this.prisma.usuario.create({
            data: {
                Rol: 'Cliente',
                PasswrdHash: hashUsuario,
                ClienteID: cliente.ClienteID,
                PersonalID: null
            }
        });

        const decodedToken = this.jwt.decode(dto.JWT);

        await this.prisma.bitacora.create({
            data: {
                UsuarioID: decodedToken.sub,
                TipoAccionBitacoraID: 4,
                FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
            }
        });

        return {
            "message": "Cliente registrado con éxito",
            "ClienteID": cliente.ClienteID,
            "UsuarioID": usuario.UsuarioID,
        }
    }

    async crearPersonal(dto: CreatePersonalDto) {
        const personalRepetido = await this.prisma.personal.findUnique({
            where: {
                Email: dto.Email,
            }
        });
        if (personalRepetido) {
            throw new ForbiddenException('El correo ingresado ya existe en base de datos.');
        }
        if (dto.CargoID === 2) { // es veterinario, se le crea un perfil de usuario
            const personal = await this.prisma.personal.create({
                data: {
                    NombreCompleto: dto.NombreCompleto,
                    Telefono: dto.Telefono,
                    Direccion: dto.Direccion,
                    Email: dto.Email,
                    FechaContratacion: dto.FechaContratacion.toISOString(),
                    CargoID: dto.CargoID,
                    ProfesionID: dto.ProfesionID
                }
            });
            const hashPersonal = await argon.hash('personalnuevo');
            const usuario = await this.prisma.usuario.create({
                data: {
                    Rol: 'Veterinario',
                    PasswrdHash: hashPersonal,
                    PersonalID: personal.PersonalID,
                    ClienteID: null
                }
            });
            const decodedToken = this.jwt.decode(dto.JWT);

            await this.prisma.bitacora.create({
                data: {
                    UsuarioID: decodedToken.sub,
                    TipoAccionBitacoraID: 3,
                    FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
                }
            });
            return {
                "message": "Personal registrado con éxito",
                "PersonalID": personal.PersonalID,
                "UsuarioID": usuario.UsuarioID,
            }
        } else { // no es veterinario, no se le crea un perfil
            const personal = await this.prisma.personal.create({
                data: {
                    NombreCompleto: dto.NombreCompleto,
                    Telefono: dto.Telefono,
                    Direccion: dto.Direccion,
                    Email: dto.Email,
                    FechaContratacion: dto.FechaContratacion,
                    CargoID: dto.CargoID,
                    ProfesionID: dto.ProfesionID
                }
            });
            const decodedToken = this.jwt.decode(dto.JWT);

            await this.prisma.bitacora.create({
                data: {
                    UsuarioID: decodedToken.sub,
                    TipoAccionBitacoraID: 4,
                    FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
                }
            });
            return {
                "message": "Personal registrado con éxito",
                "PersonalID": personal.PersonalID
            }
        }
    }

    async crearMascota(dto: CreateMascotaDto) {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const mascota = await prisma.mascota.create({
                    data: {
                        Nombre: dto.Nombre,
                        Sexo: dto.Sexo,
                        FechaNacimiento: dto.FechaDeNacimiento,
                        Observaciones: dto.Observaciones,
                        RazaID: dto.RazaID,
                        ClienteID: dto.ClienteID
                    },
                });
      
                // Aquí se puede agregar más lógica para validaciones y registros en el futuro
                // Es problema del futuro yo
                const decodedToken = this.jwt.decode(dto.JWT);

                await this.prisma.bitacora.create({
                    data: {
                        UsuarioID: decodedToken.sub,
                        TipoAccionBitacoraID: 5,
                        FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
                    }
                });
                return {
                    message: "Mascota registrada correctamente",
                    mascotaID: mascota.MascotaID,
                    propietarioID: mascota.ClienteID
                };
            });
      
            return result;
        } catch (error) {
            console.error('Error al crear la mascota:', error);
            throw new Error('No se pudo registrar la mascota. Las quejas con Rodrigo.');
        }
    }

    async getOneCliente(id: number) {
        return this.prisma.cliente.findUnique({
            where: {
                ClienteID: id
            },
            include: {
                mascotas: true
            }
        });
    }

    // async getClientes(dto: GetQueryDto) {
    //     const decodedToken = this.jwt.decode(dto.JWT);
    //     await this.prisma.bitacora.create({
    //         data: {
    //             UsuarioID: decodedToken.sub,
    //             TipoAccionBitacoraID: 10,
    //             FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
    //         }
    //     });
    //     return await this.prisma.cliente.findMany({});
    // }

    async getClientes(token: string) {
        const decodedToken = this.jwt.decode(token); // Decodificas el token recibido desde el header
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: decodedToken.sub, // Obtienes el ID del usuario del token
                TipoAccionBitacoraID: 4, // Registra la acción en la bitácora
                FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
            }
        });
    
        // Devuelves los clientes
        return await this.prisma.cliente.findMany({});
    }

    async getPersonal(dto: GetQueryDto) {
        const decodedToken = this.jwt.decode(dto.JWT);
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: decodedToken.sub,
                TipoAccionBitacoraID: 9,
                FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
            }
        });
        return await this.prisma.personal.findMany({});
    }

    async getMascotas(dto: GetQueryDto) {
        const decodedToken = this.jwt.decode(dto.JWT);
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: decodedToken.sub,
                TipoAccionBitacoraID: 11,
                FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
            }
        });
        return await this.prisma.mascota.findMany({});
    }

    async updateCliente(dto: UpdateClienteDto) {
        const cliente = await this.prisma.cliente.update({
            where: {
                ClienteID: dto.clienteID
            },
            data: {
                NombreCompleto: dto.NombreCompleto,
                Direccion: dto.Direccion,
                Telefono: dto.Telefono
            }
        });
        const decodedToken = this.jwt.decode(dto.JWT);
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: decodedToken.sub,
                TipoAccionBitacoraID: 7,
                FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
            }
        });
        return {
            "message": "Cliente actualizado con éxito",
            "ClienteID": cliente.ClienteID,
        }
    }

    async updateMascota(dto: UpdateMascotaDto) {
        const mascota = await this.prisma.mascota.update({
            where: {
                MascotaID: dto.mascotaID
            },
            data: {
                Nombre: dto.Nombre,
                Sexo: dto.Sexo,
                FechaNacimiento: dto.FechaDeNacimiento,
                Observaciones: dto.Observaciones,
            }
        });
        const decodedToken = this.jwt.decode(dto.JWT);
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: decodedToken.sub,
                TipoAccionBitacoraID: 8,
                FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
            }
        });
        return {
            "message": "Mascota actualizada con éxito",
            "MascotaID": mascota.MascotaID,
        };
    }

    async updatePersonal(dto: UpdatePersonalDto) {
        if (dto.cargoID == 2) {
            const personal =  await this.prisma.personal.update({
                where: {
                    PersonalID: dto.personalID
                },
                data: {
                    NombreCompleto: dto.nombreCompleto,
                    ProfesionID: dto.profesionID,
                    CargoID: dto.cargoID,
                    Direccion: dto.direccion,
                    Telefono: dto.telefono,
                }
            });
            
            const hashPersonal = await argon.hash('personalnuevo');
            const usuario = await this.prisma.usuario.create({
                data: {
                    Rol: 'Veterinario',
                    PasswrdHash: hashPersonal,
                    PersonalID: personal.PersonalID,
                    ClienteID: null
                }
            });
            const decodedToken = this.jwt.decode(dto.JWT);
            await this.prisma.bitacora.create({
                data: {
                    UsuarioID: decodedToken.sub,
                    TipoAccionBitacoraID: 6,
                    FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
                }
            });
            return {
                "message": "Personal actualizado con éxito",
                "PersonalID": personal.PersonalID,
                "UsuarioID": usuario.UsuarioID,
            }
        } else {
            const personal = await this.prisma.personal.update({
                where: {
                    PersonalID: dto.personalID
                },
                data: {
                    NombreCompleto: dto.nombreCompleto,
                    ProfesionID: dto.profesionID,
                    CargoID: dto.cargoID,
                    Direccion: dto.direccion,
                    Telefono: dto.telefono,
                }
            });
            const decodedToken = this.jwt.decode(dto.JWT);
            await this.prisma.bitacora.create({
                data: {
                    UsuarioID: decodedToken.sub,
                    TipoAccionBitacoraID: 6,
                    FechaHora: new Date(new Date().toLocaleString("en-US", {timeZone: "America/La_Paz"}))
                }
            });
            return {
                "message": "Personal actualizado con éxito",
                "PersonalID": personal.PersonalID,
            }
        }
    }
}
