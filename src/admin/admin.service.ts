import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePersonalDto, CreateMascotaDto, CreateClienteDto, 
        UpdatePersonalDto, UpdateClienteDto, UpdateMascotaDto } from './dto';
import { BitacoraAccion, registrarEnBitacora } from 'src/utils/index.utils';
import { parseISO } from 'date-fns';
import * as argon from 'argon2';


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
        let hash: string;
        if (rol === 'Cliente') {
            const clienteHash = this.config.get('CLIENTE_HASH'); // accesopropietario || clientenuevo
            hash = await argon.hash(clienteHash);
        } else {
            const docVetHash = this.config.get('DOCVET_HASH'); // doctorprimerizo || personalnuevo
            hash = await argon.hash(docVetHash);
        }
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
        await this.logAccion(userId, BitacoraAccion.CrearPersonal, ipDir);
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
        await this.logAccion(userId, BitacoraAccion.CrearCliente, ipDir);
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

                await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearMascota, ipDir);
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

    async getPersonalV2(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ReadPersonal, ipDir);
        return this.prisma.$queryRaw`
            SELECT
                p."PersonalID" AS "ID",
                p."NombreCompleto" AS "Nombre",
                p."Telefono",
                p."Direccion",
                TO_CHAR(p."FechaContratacion", 'YYYY-MM-DD') AS "Fecha_De_Contratacion",
                p."Activo",
                p."Email",
                c."Cargo" AS "Cargo",
                pr."Profesion" AS "Profesion"
            FROM personal p
            LEFT OUTER JOIN cargo c ON p."CargoID" = c."CargoID"
            LEFT OUTER JOIN profesion pr ON p."ProfesionID" = pr."ProfesionID"
            ORDER BY p."PersonalID" ASC;
        `;
    }

    async getClientesV2(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ReadCliente, ipDir);
        return await this.prisma.$queryRaw`
            SELECT
                c."ClienteID" AS "ClienteID",
                c."NombreCompleto" AS "NombreCompleto",
                c."Telefono" AS "Telefono",
                c."Direccion" AS "Direccion",
                c."Email" AS "Email"
            FROM cliente c
            ORDER BY c."ClienteID" ASC;
        `;
    }

    async getMascotasV2(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ReadMascota, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                m."MascotaID" AS "ID",
                m."Nombre",
                m."Sexo",
                TO_CHAR(m."FechaNacimiento", 'YYYY-MM-DD') AS "Fecha_De_Nacimiento",
                m."Observaciones",
                e."NombreEspecie" AS "Especie",
                r."NombreRaza" AS "Raza",
                c."ClienteID" AS "DueñoID"
            FROM mascota m
            JOIN raza r ON m."RazaID" = r."RazaID"
            JOIN especie e ON r."EspecieID" = e."EspecieID"
            JOIN cliente c ON m."ClienteID" = c."ClienteID";
        `;
    }

    async getBitacoraLogsV2() {
        return this.prisma.$queryRaw`
            SELECT 
              b."BitacoraID" AS "ID",
              b."UsuarioID" AS "UsuarioID",
              t."Accion" AS "Accion",
              TO_CHAR((b."FechaHora" - INTERVAL '4 hours'), 'YYYY-MM-DD HH24:MI:SS') AS "Fecha_Hora",
              b."IPDir" AS "IP"
            FROM bitacora b
            JOIN tipoaccionbitacora t 
            ON b."TipoAccionBitacoraID" = t."TipoAccionBitacoraID"
            ORDER BY b."FechaHora" DESC;
        `;
    }

    async updatePersonal(dto: UpdatePersonalDto, userId: number, ipDir: string) {
        const dataActualizada = {};
        if (dto.NombreCompleto !== undefined && dto.NombreCompleto !== "") dataActualizada['NombreCompleto'] = dto.NombreCompleto;
        if (dto.Telefono !== undefined && dto.Telefono !== "") dataActualizada['Telefono'] = dto.Telefono;
        if (dto.Direccion !== undefined && dto.Direccion !== "") dataActualizada['Direccion'] = dto.Direccion;
        if (dto.CargoID !== undefined && dto.CargoID !== "") dataActualizada['CargoID'] = parseInt(dto.CargoID);
        const personal = await this.prisma.personal.update({
            where: { PersonalID: dto.PersonalID },
            data: dataActualizada
        });
        let usuario;
        if (parseInt(dto.CargoID) === 2) {
            usuario = await this.crearUsuario('Veterinario', personal.PersonalID, true);
        }
        await this.logAccion(userId, BitacoraAccion.UpdatePersonal, ipDir);
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
        await this.logAccion(userId, BitacoraAccion.UpdateCliente, ipDir);
        return {
            message: "Cliente actualizado con éxito",
            ClienteID: cliente.ClienteID,
        };
    }

    async updateMascota(dto: UpdateMascotaDto, userId: number, ipDir: string) {
        const dataActualizada = {};
        if (dto.Nombre !== undefined && dto.Nombre !== "") dataActualizada['Nombre'] = dto.Nombre;
        if (dto.Sexo !== undefined && dto.Sexo !== "") dataActualizada['Sexo'] = dto.Sexo;
        if (dto.Observaciones !== undefined && dto.Observaciones !== "") dataActualizada['Observaciones'] = dto.Observaciones;
        if (dto.ClienteID !== undefined && dto.ClienteID !== "") dataActualizada['ClienteID'] = parseInt(dto.ClienteID);
        const mascota = await this.prisma.mascota.update({
            where: { MascotaID: dto.mascotaID },
            data: dataActualizada,
        });
        await this.logAccion(userId, BitacoraAccion.UpdateMascota, ipDir);
        return {
            message: "Mascota actualizada con éxito",
            MascotaID: mascota.MascotaID,
        };
    }
}
