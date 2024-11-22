import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReservacionDto, UpdateReservacionDto } from './dto';
import { BitacoraAccion, registrarEnBitacora } from 'src/utils/index.utils';


@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService) {}

    async crearReservacion(dto: CreateReservacionDto, userId: number, ipDir: string) {
        // 1. Obtén el cliente relacionado con el usuario
        const usuario = await this.prisma.usuario.findUnique({
            where: { UsuarioID: userId },
        });
    
        if (!usuario || !usuario.ClienteID) {
            throw new Error('Usuario no tiene un cliente asociado.');
        }
    
        const cliente = await this.prisma.cliente.findUnique({
            where: { ClienteID: usuario.ClienteID },
        });
    
        if (!cliente) {
            throw new Error('Cliente no encontrado.');
        }
    
        // 2. Valida que el servicio médico existe
        const servicioMedico = await this.prisma.servicio_medico.findUnique({
            where: { ServicioMedicoID: dto.ServicioMedicoID },
        });
    
        if (!servicioMedico) {
            throw new Error('El servicio médico no existe.');
        }
    
        // 3. Crea la reservación
        const reserva = await this.prisma.reservacion.create({
            data: {
                Motivo: dto.Motivo,
                FechaHoraReservada: dto.FechaHoraReservada,
                Estado: 'Pendiente', // Estado por defecto
                UsuarioID: userId, // Relación con el usuario que crea la reservación
                ClienteID: cliente.ClienteID, // Relación con el cliente
                ServicioMedicoID: dto.ServicioMedicoID, // Relación con el servicio médico
                MascotaID: dto.MascotaID
            },
        });
    
        // 4. Registra en la bitácora
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearReservacion, ipDir);
    
        // 5. Retorna el resultado
        return {
            Mensaje: 'Reservación registrada exitosamente.',
            ReservaID: reserva.ReservacionID,
        };
    }
    

    async getMascotas(userId: number, ipDir: string) {
        console.log(userId);
        
        // Obtener al usuario y al cliente relacionado
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
    
        // Registrar en la bitácora
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerMascota, ipDir);
    
        // Realizar la consulta SQL para obtener las mascotas junto con el cliente
        return this.prisma.$queryRaw`
            SELECT 
                m."MascotaID" AS "ID",
                m."Nombre" AS "Mascota_Nombre",
                m."Sexo",
                TO_CHAR(m."FechaNacimiento", 'YYYY-MM-DD') AS "Fecha_De_Nacimiento",
                EXTRACT(YEAR FROM AGE(m."FechaNacimiento")) AS "Años",
                EXTRACT(MONTH FROM AGE(m."FechaNacimiento")) AS "Meses",
                e."NombreEspecie" AS "Especie",
                r."NombreRaza" AS "Raza",
                c."ClienteID" AS "Cliente_ID",
                c."NombreCompleto" AS "Cliente_Nombre",
                c."Telefono" AS "Cliente_Telefono",
                c."Email" AS "Cliente_Email"
            FROM mascota m
            JOIN raza r ON m."RazaID" = r."RazaID"
            JOIN especie e ON r."EspecieID" = e."EspecieID"
            JOIN cliente c ON m."ClienteID" = c."ClienteID"
            WHERE c."ClienteID" = ${cliente.ClienteID}
            ORDER BY m."MascotaID" ASC;
        `;
    }
    

    async getReservacionesGral(userId: number, ipDir: string) {
        return this.prisma.$queryRaw`
            SELECT 
                TO_CHAR(("FechaHoraReservada"), 'YYYY-MM-DD HH24:MI:SS') AS "Fecha_Hora",
                "Estado"
            FROM reservacion
            WHERE "Estado" = 'Pendiente' AND DATE("FechaHoraReservada") >= CURRENT_DATE;
        `;
    }

    async getReservacionesCli(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerReservacion, ipDir);
        return this.prisma.$queryRaw`
            SELECT
                "ReservacionID",
                TO_CHAR(("FechaHoraReservada" - INTERVAL '4 hours'), 'YYYY-MM-DD HH24:MI:SS') AS "Fecha_Hora",
                "Estado"
            FROM reservacion
            WHERE "Estado" = 'Pendiente' AND DATE("FechaHoraReservada") >= CURRENT_DATE
            AND "UsuarioID" = ${userId}
            ORDER BY "ReservacionID" DESC;
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
    async getServicioMedico(userId: number, ipDir: string) {
        // Registrar la acción en la bitácora
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerServicioConsulta, ipDir);
    
        // Realizar la consulta SQL para obtener los servicios médicos
        return this.prisma.$queryRaw`
            SELECT 
                sm."ServicioMedicoID" AS "ID",
                sm."Nombre" AS "Nombre",
                sm."Precio" AS "Precio",
                sm."Descripcion" AS "Descripcion"
            FROM servicio_medico sm
            ORDER BY sm."Nombre" ASC;
        `;
    }
}
