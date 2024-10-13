import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePersonalDto, CreateMascotaDto, CreateClienteDto, 
        UpdatePersonalDto, UpdateClienteDto, UpdateMascotaDto } from './dto';
import * as argon from 'argon2';
import { registrarEnBitacora } from 'src/utils/index.utils';
import { format, toZonedTime } from 'date-fns-tz';
import { parseISO } from 'date-fns';



@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService, 
                private config: ConfigService) {}


    private async logAccion(userId: number, actionId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, actionId, ipDir);
    }

    private async verificarEmail(email: string) {
        const usuarioBD = await this.prisma.personal.findUnique({ where: { Email: email } })
            || await this.prisma.cliente.findUnique({ where: { Email: email } });
        if (usuarioBD) {
            throw new ForbiddenException('El correo ingresado ya existe en base de datos.');
        }
    }

    private async crearUsuario(rol: 'Veterinario' | 'Cliente', id: number, isPersonal: boolean) {
        const hash = await argon.hash(`${rol.toLowerCase()}nuevo`);
        return this.prisma.usuario.create({
            data: {
                Rol: rol,
                PasswrdHash: hash,
                PersonalID: isPersonal ? id : null,
                ClienteID: !isPersonal ? id : null
            }
        });
    }

    async crearPersonal(dto: CreatePersonalDto, userId: number, ipDir: string) {
        await this.verificarEmail(dto.Email);
        const personal = await this.prisma.personal.create({
            data: {
                NombreCompleto: dto.NombreCompleto,
                Telefono: dto.Telefono,
                Direccion: dto.Direccion,
                Email: dto.Email,
                FechaContratacion: parseISO(dto.FechaContratacion.toString()),
                CargoID: dto.CargoID,
                ProfesionID: dto.ProfesionID
            }
        });
        let usuario;
        if (dto.CargoID === 2) {
            usuario = await this.crearUsuario('Veterinario', personal.PersonalID, true);
        }
        await this.logAccion(userId, 3, ipDir);
        return {
            message: "Personal registrado con éxito",
            PersonalID: personal.PersonalID,
            ...(usuario && { UsuarioID: usuario.UsuarioID })
        };
    }

    async crearCliente(dto: CreateClienteDto, userId: number, ipDir: string) {
        await this.verificarEmail(dto.Email);
        const cliente = await this.prisma.cliente.create({
            data: {
                NombreCompleto: dto.NombreCompleto,
                Telefono: dto.Telefono,
                Direccion: dto.Direccion,
                Email: dto.Email
            }
        });
        const usuario = await this.crearUsuario('Cliente', cliente.ClienteID, false);
        await this.logAccion(userId, 4, ipDir);
        return {
            message: "Cliente registrado con éxito",
            ClienteID: cliente.ClienteID,
            UsuarioID: usuario.UsuarioID,
        };
    }

    async crearMascota(dto: CreateMascotaDto, userId: number, ipDir: string) {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const mascota = await prisma.mascota.create({
                    data: {
                        Nombre: dto.Nombre,
                        Sexo: dto.Sexo,
                        FechaNacimiento: parseISO(dto.FechaDeNacimiento.toString()),
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
            where: { ClienteID: id },
            include: { mascotas: true }
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
        const dataActualizada = {};
        if (dto.NombreCompleto !== undefined && dto.NombreCompleto !== "") dataActualizada['NombreCompleto'] = dto.NombreCompleto;
        if (dto.Telefono !== undefined && dto.Telefono !== "") dataActualizada['Telefono'] = dto.Telefono;
        if (dto.Direccion !== undefined && dto.Direccion !== "") dataActualizada['Direccion'] = dto.Direccion;
        if (dto.FechaContratacion !== undefined) dataActualizada['FechaContratacion'] = parseISO(dto.FechaContratacion.toString());
        if (dto.CargoID !== undefined && Number.isNaN(dto.CargoID)) dataActualizada['CargoID'] = dto.CargoID;
        const personal = await this.prisma.personal.update({
            where: { PersonalID: dto.PersonalID },
            data: dataActualizada
        });
        let usuario;
        if (dto.CargoID === 2) {
            usuario = await this.crearUsuario('Veterinario', personal.PersonalID, true);
        }
        await this.logAccion(userId, 9, ipDir);
        return {
            message: "Personal actualizado con éxito",
            PersonalID: personal.PersonalID,
            ...(usuario && { UsuarioID: usuario.UsuarioID })
        };
    }

    async updateCliente(dto: UpdateClienteDto, userId: number, ipDir: string) {
        const dataActualizada = {};
        if (dto.NombreCompleto !== undefined && dto.NombreCompleto !== "") dataActualizada['NombreCompleto'] = dto.NombreCompleto;
        if (dto.Telefono !== undefined && dto.Telefono !== "") dataActualizada['Telefono'] = dto.Telefono;
        if (dto.Direccion !== undefined && dto.Direccion !== "") dataActualizada['Direccion'] = dto.Direccion;
        const cliente = await this.prisma.cliente.update({
            where: { ClienteID: dto.clienteID },
            data: dataActualizada
        });
        await this.logAccion(userId, 10, ipDir);
        return {
            message: "Cliente actualizado con éxito",
            ClienteID: cliente.ClienteID,
        };
    }

    async updateMascota(dto: UpdateMascotaDto, userId: number, ipDir: string) {
        const dataActualizada = {};
        
        if (dto.Nombre !== undefined && dto.Nombre !== "") dataActualizada['Nombre'] = dto.Nombre;
        if (dto.Sexo !== undefined && dto.Sexo !== "") dataActualizada['Sexo'] = dto.Sexo;
        if (dto.FechaDeNacimiento !== undefined) dataActualizada['FechaNacimiento'] = parseISO(dto.FechaDeNacimiento.toString());
        if (dto.Observaciones !== undefined && dto.Observaciones !== "") dataActualizada['Observaciones'] = dto.Observaciones;

        const mascota = await this.prisma.mascota.update({
            where: { MascotaID: dto.mascotaID },
            data: dataActualizada,
        });
        await this.logAccion(userId, 11, ipDir);
        return {
            message: "Mascota actualizada con éxito",
            MascotaID: mascota.MascotaID,
        };
    }

    async getBitacoraEntries(limit: number = 10) {
        const entries = await this.prisma.bitacora.findMany({
            take: limit,
            orderBy: { FechaHora: 'desc' },
            include: {
                usuario: { select: { UsuarioID: true } },
                tipoAccion: { select: { TipoAccionBitacoraID: true } }
            }
        });

        const timeZone = 'America/La_Paz';
        return entries.map(entry => {
            const laPazDateTime = toZonedTime(entry.FechaHora, timeZone);
            const formattedEntry = {
                ...entry,
                FechaHoraFormateada: format(laPazDateTime, 'yyyy-MM-dd HH:mm:ss', { timeZone })
            };

            console.log(`
                ID: ${formattedEntry.BitacoraID}
                Usuario: ${formattedEntry.usuario.UsuarioID}
                Acción: ${formattedEntry.tipoAccion.TipoAccionBitacoraID}
                Fecha y hora: ${formattedEntry.FechaHoraFormateada}
                IP: ${formattedEntry.IPDir}
            `);

            return formattedEntry;
        });
    }
}
