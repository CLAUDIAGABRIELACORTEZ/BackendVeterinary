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
            // Registrar en la bitácora
            await registrarEnBitacora(this.prisma, userId, BitacoraAccion.ListarMascotas, ipDir);
            // Crear el registro de vacunación
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
        return this.prisma.$queryRaw`
        
        `;
    }
}
