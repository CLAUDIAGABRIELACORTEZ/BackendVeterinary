import { Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Role, Roles, Usuario } from 'src/auth/decorator';


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
    
    @HttpCode(HttpStatus.OK)
    @Post('reservacion')
    createReservacion(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return "Reservacion creada";
    }

    @HttpCode(HttpStatus.OK)
    @Patch('reservacion')
    updateReservacion(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return "Reservacion creada";
    }
}
