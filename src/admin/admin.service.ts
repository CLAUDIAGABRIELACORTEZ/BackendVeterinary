import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { parseISO } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { UpdateReservacionDto } from 'src/client/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BitacoraAccion, registrarEnBitacora } from 'src/utils/index.utils';
import { CreatePersonalDto, CreateMascotaDto, CreateClienteDto, 
    UpdatePersonalDto, UpdateClienteDto, UpdateMascotaDto, UpdateUsuarioDto, CreateRazaDto} from './dto';


@Injectable()
export class AdminService {
    constructor( private prisma: PrismaService, private config: ConfigService ) { }

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
            hash = await argon.hash(process.env.CLIENTE_HASH);
        } else {
            const docVetHash = this.config.get('DOCVET_HASH'); // doctorprimerizo || personalnuevo
            hash = await argon.hash(process.env.DOCVET_HASH);
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
        return await this.prisma.$transaction(async (tx) => {
            await this.verificarEmail(dto.Email);
            const personal = await tx.personal.create({
                data: {
                    NombreCompleto: dto.NombreCompleto,
                    Telefono: dto.Telefono,
                    Direccion: dto.Direccion,
                    NumeroCI: dto.NumeroCI,
                    Email: dto.Email,
                    FechaContratacion: parseISO(dto.FechaContratacion.toString()),
                    CargoID: dto.CargoID,
                    ProfesionID: dto.ProfesionID
                }
            });
            let usuario;
            if (dto.CargoID === 2) {
                const hash = await argon.hash(process.env.DOCVET_HASH);
                usuario = await tx.usuario.create({
                data: {
                    Rol: 'Veterinario',
                    PasswrdHash: hash,
                    PersonalID: personal.PersonalID
                }
            });
            }
            await this.logAccion(userId, BitacoraAccion.CrearPersonal, ipDir);
            return {
                Respuesta: "Personal registrado con éxito",
                PersonalID: personal.PersonalID,
                ...(usuario && { UsuarioID: usuario.UsuarioID })
            };
        });
    }

    async crearCliente(dto: CreateClienteDto, userId: number, ipDir: string) {
        return await this.prisma.$transaction(async (tx) => {
            await this.verificarEmail(dto.Email);
            const cliente = await tx.cliente.create({
                data: {
                    NombreCompleto: dto.NombreCompleto,
                    Telefono: dto.Telefono,
                    NumeroCI: dto.NumeroCI,
                    Direccion: dto.Direccion,
                    Email: dto.Email
                }
            });
            const hash = await argon.hash(process.env.CLIENTE_HASH);
            const usuario = await tx.usuario.create({
                data: {
                    Rol: 'Cliente',
                    PasswrdHash: hash,
                    ClienteID: cliente.ClienteID
                }
            });
            await this.logAccion(userId, BitacoraAccion.CrearCliente, ipDir);
            return {
                Respuesta: "Cliente registrado con éxito",
                ClienteID: cliente.ClienteID,
                UsuarioID: usuario.UsuarioID,
            };
        });
    }

    async crearRaza(dto: CreateRazaDto, userId: number, ipDir: string) {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const raza = await prisma.raza.create({
                    data: {
                        NombreRaza: dto.NombreRaza,
                        EspecieID: dto.EspecieID
                    },
                });

                await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearRaza, ipDir);
                return {
                    Respuesta: "Raza registrada correctamente",
                    RazaID: raza.RazaID
                };
            });
            return result;
        } catch (error) {
            console.error('Error al registrar la raza:', error);
            throw new Error('No se pudo registrar la raza. Las quejas con Rodrigo.');
        }
    }

    async getEspecie(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerRaza, ipDir);
        return await this.prisma.$queryRaw`
            SELECT 
                especie."EspecieID",
                especie."NombreEspecie"
            FROM especie
        `;
    }

    async getRazas(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerRaza, ipDir);
        return await this.prisma.$queryRaw`
            SELECT 
                raza."RazaID",
                raza."NombreRaza",
                especie."NombreEspecie"
            FROM raza
            JOIN especie ON raza."EspecieID" = especie."EspecieID";
        `;
    }

    async crearMascota(dto: CreateMascotaDto, userId: number, ipDir: string) {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const cliente = await prisma.cliente.findFirst({
                    where: { NumeroCI: dto.ClienteCI }
                });
                const mascota = await prisma.mascota.create({
                    data: {
                        Nombre: dto.Nombre,
                        Sexo: dto.Sexo,
                        FechaNacimiento: parseISO(dto.FechaDeNacimiento.toString()),
                        Observaciones: dto.Observaciones,
                        RazaID: dto.RazaID,
                        ClienteID: cliente.ClienteID
                    },
                });
      
                // Aquí se puede agregar más lógica para validaciones y registros en el futuro
                // Es problema del futuro yo

                await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearMascota, ipDir);
                return {
                    Respuesta: "Mascota registrada correctamente",
                    MascotaID: mascota.MascotaID,
                    PropietarioID: mascota.ClienteID
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

    // adolfomendozaribera400@gmail.com

    async getPersonal(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerPersonal, ipDir);
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

    async getClientes(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerCliente, ipDir);
        return await this.prisma.$queryRaw`
            SELECT
                c."ClienteID" AS "ClienteID",
                c."NombreCompleto" AS "NombreCompleto",
                c."NumeroCI" AS "CI",
                c."Telefono" AS "Telefono",
                c."Direccion" AS "Direccion",
                c."Email" AS "Email"
            FROM cliente c
            ORDER BY c."ClienteID" ASC;
        `;
    }

    async getMascotas(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerMascota, ipDir);
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
            JOIN cliente c ON m."ClienteID" = c."ClienteID"
            ORDER BY m."MascotaID" ASC;
        `;
    }

    async getBitacoraLogs() {
        return this.prisma.$queryRaw`
            SELECT 
              b."BitacoraID" AS "ID",
              b."UsuarioID" AS "UsuarioID",
              t."Accion" AS "Accion",
              TO_CHAR((b."FechaHora"), 'YYYY-MM-DD HH24:MI:SS') AS "Fecha_Hora",
              b."IPDir" AS "IPDir"
            FROM bitacora b
            JOIN tipoaccionbitacora t 
            ON b."TipoAccionBitacoraID" = t."TipoAccionBitacoraID"
            ORDER BY b."BitacoraID" DESC;
        `;
    }

    async updatePersonal(dto: UpdatePersonalDto, userId: number, ipDir: string) {
        const dataActualizada: any = {};
        if (dto.NombreCompleto !== undefined && dto.NombreCompleto !== "") dataActualizada['NombreCompleto'] = dto.NombreCompleto;
        if (dto.Telefono !== undefined && dto.Telefono !== "") dataActualizada['Telefono'] = dto.Telefono;
        if (dto.Direccion !== undefined && dto.Direccion !== "") dataActualizada['Direccion'] = dto.Direccion;
        if (dto.CargoID !== undefined && dto.CargoID !== "") dataActualizada['CargoID'] = parseInt(dto.CargoID);
    
        return await this.prisma.$transaction(async (prisma) => {
            // Actualizar la información del personal
            const personal = await prisma.personal.update({
                where: { PersonalID: dto.ID },
                data: dataActualizada,
            });
    
            // Crear usuario si el CargoID es 2
            let usuario;
            if (parseInt(dto.CargoID) === 2) {
                usuario = await this.crearUsuario('Veterinario', personal.PersonalID, true);
            }
    
            // Registrar la acción en la bitácora
            await this.logAccion(userId, BitacoraAccion.ActualizarPersonal, ipDir);
    
            // Retornar la respuesta consolidada
            return {
                Respuesta: "Personal actualizado con éxito",
                PersonalID: personal.PersonalID,
                ...(usuario && { UsuarioID: usuario.UsuarioID }),
            };
        });
    }

    async updateCliente(dto: UpdateClienteDto, userId: number, ipDir: string) {
        const dataActualizada: any = {};
        if (dto.NombreCompleto !== undefined && dto.NombreCompleto !== "") dataActualizada['NombreCompleto'] = dto.NombreCompleto;
        if (dto.Telefono !== undefined && dto.Telefono !== "") dataActualizada['Telefono'] = dto.Telefono;
        if (dto.Direccion !== undefined && dto.Direccion !== "") dataActualizada['Direccion'] = dto.Direccion;
    
        return await this.prisma.$transaction(async (prisma) => {
            const cliente = await prisma.cliente.update({
                where: { ClienteID: dto.ClienteID },
                data: dataActualizada,
            });
    
            await this.logAccion(userId, BitacoraAccion.ActualizarCliente, ipDir);
    
            return {
                Respuesta: "Cliente actualizado con éxito",
                ClienteID: cliente.ClienteID,
            };
        });
    }

    async updateMascota(dto: UpdateMascotaDto, userId: number, ipDir: string) {
        const dataActualizada: any = {};
        if (dto.Nombre !== undefined && dto.Nombre !== "") dataActualizada['Nombre'] = dto.Nombre;
        if (dto.Sexo !== undefined && dto.Sexo !== "") dataActualizada['Sexo'] = dto.Sexo;
        if (dto.Observaciones !== undefined && dto.Observaciones !== "") dataActualizada['Observaciones'] = dto.Observaciones;
        if (dto.ClienteID !== undefined && dto.ClienteID !== "") dataActualizada['ClienteID'] = parseInt(dto.ClienteID);
    
        return await this.prisma.$transaction(async (prisma) => {
            const mascota = await prisma.mascota.update({
                where: { MascotaID: dto.ID },
                data: dataActualizada,
            });
    
            await this.logAccion(userId, BitacoraAccion.ActualizarMascota, ipDir);
    
            return {
                Respuesta: "Mascota actualizada con éxito",
                MascotaID: mascota.MascotaID,
            };
        });
    }

    async getUsuariosActivos(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerPersonal, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                u."UsuarioID",
                u."Rol",
                CASE 
                    WHEN u."PersonalID" IS NOT NULL THEN p."NombreCompleto"
                    WHEN u."ClienteID" IS NOT NULL THEN c."NombreCompleto"
                END as "Nombre",
                u."Estado"
            FROM usuario u
            LEFT JOIN personal p ON u."PersonalID" = p."PersonalID"
            LEFT JOIN cliente c ON u."ClienteID" = c."ClienteID"
            WHERE u."Estado" = 'Activo'
            ORDER BY u."UsuarioID" ASC;
        `;
    }

    async getUsuariosInactivos(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerPersonal, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                u."UsuarioID",
                u."Rol",
                CASE 
                    WHEN u."PersonalID" IS NOT NULL THEN p."NombreCompleto"
                    WHEN u."ClienteID" IS NOT NULL THEN c."NombreCompleto"
                END as "Nombre",
                u."Estado"
            FROM usuario u
            LEFT JOIN personal p ON u."PersonalID" = p."PersonalID"
            LEFT JOIN cliente c ON u."ClienteID" = c."ClienteID"
            WHERE u."Estado" = 'Inactivo'
            ORDER BY u."UsuarioID" ASC;
        `;
    }

    async inhabilitarUsuario(dto: UpdateUsuarioDto, userId: number, ipDir: string) {
        return await this.prisma.$transaction(async (prisma) => {
            const usuario = await prisma.usuario.update({
                where: { UsuarioID: dto.UsuarioID },
                data: { Estado: 'Inactivo' },
            });
    
            await this.logAccion(userId, BitacoraAccion.DesactivarUsuario, ipDir);
    
            return {
                Respuesta: "Usuario inactivado exitosamente",
                UsuarioID: usuario.UsuarioID,
            };
        });
    }

    async habilitarUsuario(dto: UpdateUsuarioDto, userId: number, ipDir: string) {
        return await this.prisma.$transaction(async (prisma) => {
            const usuario = await prisma.usuario.update({
                where: { UsuarioID: dto.UsuarioID },
                data: { Estado: 'Activo' },
            });
    
            await this.logAccion(userId, BitacoraAccion.RehabilitarUsuario, ipDir);
    
            return {
                Respuesta: "Usuario activado exitosamente",
                UsuarioID: usuario.UsuarioID,
            };
        });
    }

    async getReservacionesGral(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerReservacion, ipDir);
        return this.prisma.$queryRaw`
            SELECT
                r."ReservacionID",
                TO_CHAR((r."FechaHoraReservada"), 'YYYY-MM-DD HH24:MI:SS') AS "Fecha_Hora",
                u."UsuarioID",
                c."NombreCompleto" AS "NombreCliente",
                r."Estado"
            FROM reservacion r
            JOIN usuario u ON r."UsuarioID" = u."UsuarioID"
            JOIN cliente c ON u."ClienteID" = c."ClienteID"
            WHERE r."Estado" = 'Pendiente'
            AND DATE(r."FechaHoraReservada") >= CURRENT_DATE;
        `;
    }

    async updateReservacion(dto: UpdateReservacionDto, userId: number, ipDir: string) {
        const reserva = await this.prisma.reservacion.update({
            where: { ReservacionID: dto.ReservacionID },
            data: { Estado: 'Cancelada' }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CancelarReservacion, ipDir);
        return {
            Respuesta : "Reservación cancelada",
            ReservaID : reserva.ReservacionID
        }
    }
}
