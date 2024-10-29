import { Injectable } from '@nestjs/common';
import { CreateReservacionDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BitacoraAccion, registrarEnBitacora } from 'src/utils/index.utils';


@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) {}

    async crearReservacion(dto: CreateReservacionDto, userId: number, ipDir: string) {
        const reserva = this.prisma.reservacion.create({
            data: {
                Motivo: dto.Motivo,
                UsuarioID: userId,
                FechaHoraReservada: dto.FechaHoraReservada
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearReservacion, ipDir);
        return {
            Mensaje: "Reservación registrada exitosamente.",
            ReservaID: (await reserva).ReservacionID
        }
    }

    async cancelarReservacion(userId: number, ipDir: string) {
        const reserva = this.prisma.reservacion.update({
            where: {
                ReservacionID: 1
            },
            data: {
                Estado: 'Cancelada'
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ActualizarReservacion, ipDir);
        return {
            Mensaje: "Reservación cancelada.",
            ReservaID: (await reserva).ReservacionID
        }
    }

    async getMascotas(userId: number, ipDir: string) {
        const usuario = await this.prisma.usuario.findUnique({
            where: {
                UsuarioID: userId
            }
        });
        const cliente = await this.prisma.cliente.findUnique({
            where: {
                ClienteID: usuario.ClienteID
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ListarMascotas, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                m."MascotaID" AS "ID",
                m."Nombre",
                m."Sexo",
                TO_CHAR(m."FechaNacimiento", 'YYYY-MM-DD') AS "Fecha_De_Nacimiento",
                EXTRACT(YEAR FROM AGE(m."FechaNacimiento")) AS "Años",
                EXTRACT(MONTH FROM AGE(m."FechaNacimiento")) AS "Meses",
                e."NombreEspecie" AS "Especie",
                r."NombreRaza" AS "Raza"
            FROM mascota m
            JOIN raza r ON m."RazaID" = r."RazaID"
            JOIN especie e ON r."EspecieID" = e."EspecieID"
            JOIN cliente c ON m."ClienteID" = c."ClienteID"
            WHERE c."ClienteID" = ${cliente.ClienteID}
            ORDER BY m."MascotaID" ASC;
        `;
    }

    // async getReservaciones(userId: number, ipDir: string) {
    //     await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ListarReservacion, ipDir);
    //     return this.prisma.$queryRaw`
    //         SELECT 
    //             TO_CHAR(("FechaHoraReservada" - INTERVAL '4 hours'), 'YYYY-MM-DD HH24:MI:SS') AS "Fecha_Hora",
    //             "Estado"
    //         FROM reservacion;
    //     `;
    // }

    async getReservaciones(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ListarReservacion, ipDir);
        const diaActual = new Date();
        diaActual.setHours(diaActual.getHours() - 4);
        const formattedDate = diaActual.toISOString().split('T')[0].toString();
        console.log({formattedDate});
        return this.prisma.$queryRaw`
            SELECT 
                TO_CHAR(("FechaHoraReservada" - INTERVAL '4 hours'), 'YYYY-MM-DD HH24:MI:SS') AS "Fecha_Hora",
                "Estado"
            FROM 
                reservacion
            WHERE 
                "Estado" = 'Pendiente' AND
                DATE("FechaHoraReservada") = CURRENT_DATE;
        `;
    }
}
