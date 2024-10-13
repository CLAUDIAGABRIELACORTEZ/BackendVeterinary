import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePersonalDto, CreateMascotaDto, CreateClienteDto, 
        UpdatePersonalDto, UpdateClienteDto, UpdateMascotaDto } from './dto';
import { PrismaClient, usuario_Rol } from '@prisma/client';
import * as argon from 'argon2';
import { registrarEnBitacora } from 'src/utils/index.utils';
import { format, toZonedTime } from 'date-fns-tz';



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
            await registrarEnBitacora(this.prisma, userId, 3, ipDir);
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
            await registrarEnBitacora(this.prisma, userId, 3, ipDir);
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
        await registrarEnBitacora(this.prisma, userId, 4, ipDir);

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
                await registrarEnBitacora(this.prisma, userId, 5, ipDir);
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
        return await this.prisma.cliente.findUnique({
            where: {
                ClienteID: id
            },
            include: {
                mascotas: true
            }
        });
    }

    async getPersonal(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, 6, ipDir);
        return await this.prisma.personal.findMany({});
    }

    async getClientes(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, 7, ipDir);
        return await this.prisma.cliente.findMany({});
    }

    async getMascotas(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, 8, ipDir);
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
            await registrarEnBitacora(this.prisma, userId, 9, ipDir);
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
            await registrarEnBitacora(this.prisma, userId, 9, ipDir);
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
        await registrarEnBitacora(this.prisma, userId, 10, ipDir);
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
        await registrarEnBitacora(this.prisma, userId, 11, ipDir);
        return {
            "message": "Mascota actualizada con éxito",
            "MascotaID": mascota.MascotaID,
        };
    }

    async getBitacoraEntries( limit: number = 10) {
        const entries = await this.prisma.bitacora.findMany({
            take: limit,
            orderBy: {
                FechaHora: 'desc'
            },
            include: {
                usuario: {
                    select: {
                        UsuarioID: true
                    }
                },
                tipoAccion: {
                    select: {
                        TipoAccionBitacoraID: true
                    }
                }
            }
        });
        const timeZone = 'America/La_Paz';
        const formattedEntries = entries.map(entry => {
            const laPazDateTime = toZonedTime(entry.FechaHora, timeZone);
            return {
                ...entry,
                FechaHoraFormateada: format(laPazDateTime, 'yyyy-MM-dd HH:mm:ss', { timeZone })
            };
        });
      
        formattedEntries.forEach(entry => {
            console.log(`
                ID: ${entry.BitacoraID}
                Usuario: ${entry.usuario.UsuarioID}
                Acción: ${entry.tipoAccion.TipoAccionBitacoraID}
                Fecha y hora: ${entry.FechaHoraFormateada}
                IP: ${entry.IPDir}
            `);
        });
        return formattedEntries;
    }
}
