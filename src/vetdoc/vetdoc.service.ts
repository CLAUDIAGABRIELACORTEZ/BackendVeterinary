import { Injectable } from '@nestjs/common';
import { parseISO } from 'date-fns';
import { UpdateReservacionDto } from 'src/client/dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BitacoraAccion, registrarEnBitacora } from 'src/utils/index.utils';
import { CreatePeluqueriaDto, CreateRegvacDto, CreateVacunaDto } from './dto';


@Injectable()
export class VetdocService {
    constructor(private prisma: PrismaService) {}

    async createVacuna(dto: CreateVacunaDto, userId: number, ipDir: string) {
        const result = await this.prisma.$transaction(async (prisma) => {
            await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearVacuna, ipDir);
            const vacuna = await prisma.vacuna.create({
                data: {
                    NombreVacuna: dto.NombreVacuna,
                    Descripcion: dto.Descripcion,
                    Laboratorio: dto.Laboratorio,
                    EdadMinima: dto.EdadMinima,
                    Tipo: dto.Tipo
                }
            });
            return vacuna;
        });
        return {
            Respuesta: "Vacuna registrada exitosamente.",
            VacunaID: result.VacunaID
        };
    }

    async createRegVac(dto: CreateRegvacDto, userId: number, ipDir: string) {
        const result = await this.prisma.$transaction(async (prisma) => {
            const regVac = await prisma.registrodevacunas.create({
                data: {
                    FechaVacunacion: parseISO(dto.FechaVacunacion.toISOString()),
                    ProximaFecha: parseISO(dto.ProximaFecha.toISOString()),
                    MascotaID: dto.MascotaID,
                    VacunaID: dto.VacunaID
                }
            });
            await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearRegVac, ipDir);
            return regVac;
        });
        return {
            Respuesta: "Vacunación registrada exitosamente.",
            RegvacID: result.RegistroID,
            MascotaID: result.MascotaID
        };
    }

    async createServPeluqueria(dto: CreatePeluqueriaDto, userId: number, ipDir: string) {
        await this.prisma.reservacion.update({
            where: { ReservacionID: dto.ReservacionID },
            data: { Estado: 'Realizada' }
        });
        const servicio = await this.prisma.servicio.create({
            data: {
                TipoServicio: 'Peluqueria',
                FechaHoraInicio: parseISO(new Date().toISOString()),
                MascotaID: dto.MascotaID,
                PersonalID: userId,
                ReservacionID: dto.ReservacionID
            }
        });
        const peluqueria = await this.prisma.peluqueria.create({
            data: {
                TipoCorte: dto.TipoCorte,
                Lavado: dto.Lavado,
                ServicioID: servicio.ServicioID
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearServicioPeluqueria, ipDir);
        return {
            Message: "Servicio registrado exitosamente",
            ServicioID: servicio.ServicioID,
            PeluqueriaID: peluqueria.ID
        }
    }

    async getVacunas(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ListarVacunas, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                "VacunaID" AS "ID",
                "NombreVacuna" AS "Vacuna",
                "Descripcion",
                "Laboratorio",
                "Tipo",
                "EdadMinima"
            FROM "vacuna"
        `;    
    }

    async leerRegVac(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ListarRegVac, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                m."MascotaID",
                m."Nombre",
                r."NombreRaza" AS "Raza",
                v."NombreVacuna" AS "Vacuna",
                reg."FechaVacunacion" AS "Fecha_De_Vacunacion",
                reg."ProximaFecha" AS "Proxima_Fecha"
            FROM "registrodevacunas" reg
            JOIN "mascota" m ON reg."MascotaID" = m."MascotaID"
            JOIN "vacuna" v ON reg."VacunaID" = v."VacunaID"
            JOIN "raza" r ON m."RazaID" = r."RazaID";
        `;
    }
    
    async leerRegVacMascota(mascotaID: number, userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ListarRegVac, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                m."Nombre" AS "Nombre",
                r."NombreRaza" AS "Raza",
                v."NombreVacuna" AS "Vacuna",
                reg."FechaVacunacion" AS "Fecha_De_Vacunacion",
                reg."ProximaFecha" AS "Proxima_Fecha"
            FROM "registrodevacunas" reg
            JOIN "mascota" m ON reg."MascotaID" = m."MascotaID"
            JOIN "vacuna" v ON reg."VacunaID" = v."VacunaID"
            JOIN "raza" r ON m."RazaID" = r."RazaID"
            WHERE m."MascotaID" = ${mascotaID};
        `;
    }

    async getReservacionesGral(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ListarReservacion, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                reservacion."ReservacionID",
                reservacion."Estado",
                TO_CHAR((reservacion."FechaHoraReservada"), 'YYYY-MM-DD HH24:MI:SS') AS "Hora",
                cliente."NombreCompleto" AS "Cliente",
                cliente."ClienteID" AS "ClienteID"
            FROM reservacion
            JOIN usuario ON reservacion."UsuarioID" = usuario."UsuarioID"
            JOIN cliente ON usuario."ClienteID" = cliente."ClienteID"
            WHERE reservacion."FechaHoraReservada" <= CURRENT_DATE 
            AND reservacion."Estado" = 'Pendiente'
            ORDER BY reservacion."FechaHoraReservada" DESC;
        `;
    }

    async getMascotasCli(ClienteID: number, userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ListarMascotas, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                m."MascotaID",
                m."Nombre"
            FROM mascota m
            JOIN cliente c ON m."ClienteID" = c."ClienteID"
            WHERE c."ClienteID" = ${ClienteID}
            ORDER BY m."MascotaID" ASC;
        `;
    }
    
    async getServPeluqeriasEnProceso(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerServicioPeluqueria, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                peluqueria."ID",
                peluqueria."TipoCorte",
                peluqueria."Lavado",
                servicio."Estado",
                servicio."FechaHoraInicio"
            FROM peluqueria
            JOIN servicio ON peluqueria."ServicioID" = servicio."ServicioID"
            WHERE servicio."Estado" = 'En Proceso';
        `;
    }

    async updateReservacion(dto: UpdateReservacionDto, userId: number, ipDir: string) {
        const reserva = await this.prisma.reservacion.update({
            where: { ReservacionID: dto.ReservacionID },
            data: { Estado: 'Realizada' }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CerrarReservacion, ipDir);
        return {
            Respuesta : "Reservación realizada",
            ReservaID : reserva.ReservacionID
        }
    }
}
