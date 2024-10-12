import { PrismaClient } from '@prisma/client';
import { toZonedTime } from 'date-fns-tz';



export async function registrarEnBitacora(
    prisma: PrismaClient,
    userId: number,
    tipoAccionId: number,
    ipDir: string
    ) {
        const now = new Date();
        const laPazDateTime = toZonedTime(now, 'America/La_Paz');
        console.log({
            "hora_LaPaz": laPazDateTime,
            "accion": tipoAccionId});
        await prisma.bitacora.create({
            data: {
                UsuarioID: userId,
                TipoAccionBitacoraID: tipoAccionId,
                FechaHora: laPazDateTime,
                IPDir: ipDir
            }
        });
}
