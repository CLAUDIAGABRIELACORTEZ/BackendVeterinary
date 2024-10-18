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
        return await this.prisma.mascota.findMany({
            where: {
                ClienteID: cliente.ClienteID
            }
        });
    }
}
