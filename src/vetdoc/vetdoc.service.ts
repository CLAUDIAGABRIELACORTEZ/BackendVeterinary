import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BitacoraAccion } from 'src/utils/bitacoraAccion';
import { registrarEnBitacora } from 'src/utils/registrarEnBitacora';
import { CreateRegvacDto } from './dto';


@Injectable()
export class VetdocService {
    constructor(private prisma: PrismaService) {}

    async createRegVac(dto: CreateRegvacDto, userId: number, ipDir: string) {
        const result = await this.prisma.$transaction(async (prisma) => {
            await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearRegVac, ipDir);
            const regVac = await prisma.registrodevacunas.create({
                data: {
                    FechaVacunacion: dto.FechaVacunacion,
                    ProximaFecha: dto.ProximaFecha,
                    MascotaID: dto.MascotaID,
                    VacunaID: dto.VacunaID
                }
            });
    
            return regVac;
        });
    
        return {
            Mensaje: "Vacunación registrada exitosamente.",
            RegvacID: result.RegistroID
        };
    }
    
    async getRegVacMascota(mascotaID: number, userId: number, ipDir: string) {
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
}
