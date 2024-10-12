import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePersonalDto, CreateMascotaDto, CreateClienteDto, 
        UpdatePersonalDto, UpdateClienteDto, UpdateMascotaDto } from './dto';
import { usuario_Rol } from '@prisma/client';
import * as argon from 'argon2';
import { format, toZonedTime } from 'date-fns-tz';
import { parseISO } from 'date-fns';



@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService, 
                private config: ConfigService) {}

    async crearPersonal(dto: CreatePersonalDto, userId: number, ipDir: string) {
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
            const now = new Date();
            const laPazDateTime = toZonedTime(now, 'America/La_Paz');
            const formattedDateTime = format(laPazDateTime, "yyyy-MM-dd HH:mm:ss");
            const parsedDateTime = parseISO(formattedDateTime);
            await this.prisma.bitacora.create({
                data: {
                    UsuarioID: userId,
                    TipoAccionBitacoraID: 3,
                    FechaHora: parsedDateTime,
                    IPDir: ipDir
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
            const now = new Date();
            const laPazDateTime = toZonedTime(now, 'America/La_Paz');
            const formattedDateTime = format(laPazDateTime, "yyyy-MM-dd HH:mm:ss");
            const parsedDateTime = parseISO(formattedDateTime);
            await this.prisma.bitacora.create({
                data: {
                    UsuarioID: userId,
                    TipoAccionBitacoraID: 4,
                    FechaHora: parsedDateTime,
                    IPDir: ipDir
                }
            });
            return {
                "message": "Personal registrado con éxito",
                "PersonalID": personal.PersonalID
            }
        }
    }

    async crearCliente(dto: CreateClienteDto, userId: number, ipDir: string) {
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
        const now = new Date();
        const laPazDateTime = toZonedTime(now, 'America/La_Paz');
        const formattedDateTime = format(laPazDateTime, "yyyy-MM-dd HH:mm:ss");
        const parsedDateTime = parseISO(formattedDateTime);
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: userId,
                TipoAccionBitacoraID: 4,
                FechaHora: parsedDateTime,
                IPDir: ipDir
            }
        });

        return {
            "message": "Cliente registrado con éxito",
            "ClienteID": cliente.ClienteID,
            "UsuarioID": usuario.UsuarioID,
        }
    }

    async crearMascota(dto: CreateMascotaDto, userId: number, ipDir: string) {
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
                const now = new Date();
                const laPazDateTime = toZonedTime(now, 'America/La_Paz');
                const formattedDateTime = format(laPazDateTime, "yyyy-MM-dd HH:mm:ss");
                const parsedDateTime = parseISO(formattedDateTime);
                await this.prisma.bitacora.create({
                    data: {
                        UsuarioID: userId,
                        TipoAccionBitacoraID: 5,
                        FechaHora: parsedDateTime,
                        IPDir: ipDir
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

    async getPersonal(userId: number, ipDir: string) {
        const now = new Date();
        const laPazDateTime = toZonedTime(now, 'America/La_Paz');
        const formattedDateTime = format(laPazDateTime, "yyyy-MM-dd HH:mm:ss");
        const parsedDateTime = parseISO(formattedDateTime);
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: userId,
                TipoAccionBitacoraID: 9,
                FechaHora: parsedDateTime,
                IPDir: ipDir
            }
        });
    
        return await this.prisma.personal.findMany({});
    }

    async getClientes(userId: number, ipDir: string) {
        const now = new Date();
        const laPazDateTime = toZonedTime(now, 'America/La_Paz');
        const formattedDateTime = format(laPazDateTime, "yyyy-MM-dd HH:mm:ss");
        const parsedDateTime = parseISO(formattedDateTime);
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: userId,
                TipoAccionBitacoraID: 10,
                FechaHora: parsedDateTime,
                IPDir: ipDir
            }
        });
    
        return await this.prisma.cliente.findMany({});
    }

    async getMascotas(userId: number, ipDir: string) {
        const now = new Date();
        const laPazDateTime = toZonedTime(now, 'America/La_Paz');
        const formattedDateTime = format(laPazDateTime, "yyyy-MM-dd HH:mm:ss");
        const parsedDateTime = parseISO(formattedDateTime);
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: userId,
                TipoAccionBitacoraID: 11,
                FechaHora: parsedDateTime,
                IPDir: ipDir
            }
        });
        return await this.prisma.mascota.findMany({});
    }

    async updatePersonal(dto: UpdatePersonalDto, userId: number, ipDir: string) {
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
            const now = new Date();
            const laPazDateTime = toZonedTime(now, 'America/La_Paz');
            const formattedDateTime = format(laPazDateTime, "yyyy-MM-dd HH:mm:ss");
            const parsedDateTime = parseISO(formattedDateTime);
            await this.prisma.bitacora.create({
                data: {
                    UsuarioID: userId,
                    TipoAccionBitacoraID: 6,
                    FechaHora: parsedDateTime,
                    IPDir: ipDir
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
            const hashPersonal = await argon.hash('personalnuevo');
            const usuario = await this.prisma.usuario.create({
                data: {
                    Rol: 'Veterinario',
                    PasswrdHash: hashPersonal,
                    PersonalID: personal.PersonalID,
                    ClienteID: null
                }
            });
            const now = new Date();
            const laPazDateTime = toZonedTime(now, 'America/La_Paz');
            const formattedDateTime = format(laPazDateTime, "yyyy-MM-dd HH:mm:ss");
            const parsedDateTime = parseISO(formattedDateTime);
            await this.prisma.bitacora.create({
                data: {
                    UsuarioID: userId,
                    TipoAccionBitacoraID: 6,
                    FechaHora: parsedDateTime,
                    IPDir: ipDir
                }
            });
            return {
                "message": "Personal actualizado con éxito",
                "PersonalID": personal.PersonalID,
            }
        }
    }

    async updateCliente(dto: UpdateClienteDto, userId: number, ipDir: string) {
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
        const now = new Date();
        const laPazDateTime = toZonedTime(now, 'America/La_Paz');
        const formattedDateTime = format(laPazDateTime, "yyyy-MM-dd HH:mm:ss");
        const parsedDateTime = parseISO(formattedDateTime);
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: userId,
                TipoAccionBitacoraID: 7,
                FechaHora: parsedDateTime,
                IPDir: ipDir
            }
        });
        return {
            "message": "Cliente actualizado con éxito",
            "ClienteID": cliente.ClienteID,
        }
    }

    async updateMascota(dto: UpdateMascotaDto, userId: number,ipDir: string) {
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
        const now = new Date();
        const laPazDateTime = toZonedTime(now, 'America/La_Paz');
        const formattedDateTime = format(laPazDateTime, "yyyy-MM-dd HH:mm:ss");
        const parsedDateTime = parseISO(formattedDateTime);
        await this.prisma.bitacora.create({
            data: {
                UsuarioID: userId,
                TipoAccionBitacoraID: 8,
                FechaHora: parsedDateTime,
                IPDir: ipDir
            }
        });
        return {
            "message": "Mascota actualizada con éxito",
            "MascotaID": mascota.MascotaID,
        };
    }
}
