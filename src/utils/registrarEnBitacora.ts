import { PrismaClient } from '@prisma/client';
import { format, toZonedTime } from 'date-fns-tz';



export async function registrarEnBitacora(
    prisma: PrismaClient,
    userId: number,
    tipoAccionId: number,
    ipDir: string
    ) {
    const timeZone = 'America/La_Paz';
    const laPazZonaHoraria = toZonedTime(new Date(), 'America/La_Paz');
    const hora_LaPaz_Formateada = format(laPazZonaHoraria, 'yyyy-MM-dd HH:mm:ss', { timeZone });
    console.log({
        "hora_LaPaz": laPazZonaHoraria,
        "hora_LaPaz_Formateada": hora_LaPaz_Formateada,
        "accion": tipoAccionId});
    await prisma.bitacora.create({
        data: {
            UsuarioID: userId,
            TipoAccionBitacoraID: tipoAccionId,
            FechaHora: laPazZonaHoraria,
            IPDir: ipDir
        }
    });
}
