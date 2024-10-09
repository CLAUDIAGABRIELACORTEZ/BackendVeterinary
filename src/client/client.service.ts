import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMascotasDto } from './dto';



@Injectable()
export class ClientService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async getMascotas(dto: GetMascotasDto) {
        const decodedToken = this.jwt.decode(dto.JWT);
        const usuario = await this.prisma.usuario.findUnique({
            where: {
                UsuarioID: decodedToken.sub
            }
        });
        const cliente = await this.prisma.cliente.findUnique({
            where: {
                ClienteID: usuario.ClienteID
            }
        });
        return await this.prisma.mascota.findMany({
            where: {
                ClienteID: cliente.ClienteID
            }
        });
    }
}
