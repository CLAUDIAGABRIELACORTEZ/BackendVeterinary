import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BitacoraAccion, registrarEnBitacora } from 'src/utils/index.utils';
import { CreateRegvacDto, CreateVacunaDto } from './dto';
import { parseISO } from 'date-fns';


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
            await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearRegVac, ipDir);
            const regVac = await prisma.registrodevacunas.create({
                data: {
                    FechaVacunacion: parseISO(dto.FechaVacunacion.toISOString()),
                    ProximaFecha: parseISO(dto.ProximaFecha.toISOString()),
                    MascotaID: dto.MascotaID,
                    VacunaID: dto.VacunaID
                }
            });
    
            return regVac;
        });
    
        return {
            Respuesta: "Vacunación registrada exitosamente.",
            RegvacID: result.RegistroID,
            MascotaID: result.MascotaID
        };
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
