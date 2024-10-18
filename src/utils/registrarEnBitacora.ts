import { PrismaClient } from '@prisma/client';
import { toZonedTime } from 'date-fns-tz';


export async function registrarEnBitacora(
    prisma: PrismaClient,
    userId: number,
    tipoAccionId: number,
    ipDir: string
    ) {
    const laPazZonaHoraria = toZonedTime(new Date(), 'America/La_Paz');
    
    await prisma.bitacora.create({
        data: {
            UsuarioID: userId,
            TipoAccionBitacoraID: tipoAccionId,
            FechaHora: laPazZonaHoraria,
            IPDir: ipDir
        }
    });
}
