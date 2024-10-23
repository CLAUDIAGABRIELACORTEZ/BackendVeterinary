import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Role, Roles, Usuario } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { ClientService } from './client.service';


@Controller('cliente')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.CLIENT)
export class ClientController {
    constructor(private readonly clientService: ClientService) {}
    
    @HttpCode(HttpStatus.OK)
    @Get('mascotas')    // {{local}}/client/mascotas
    getMascotas(@Usuario() { userId, ip }: { userId: number, ip: string }) { // devuelve todas las mascotas del cliente
        return this.clientService.getMascotas(userId, ip);
    }
}
