import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { BitacoraAccion, registrarEnBitacora } from 'src/utils/index.utils';


@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

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
}
