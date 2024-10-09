import { Body, Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { Role, Roles } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { ClientService } from './client.service';
import { GetMascotasDto } from './dto';



@Controller('client')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.CLIENT)
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @HttpCode(HttpStatus.OK)
    @Get('mascotas')    // {{local}}/client/mascotas
    getMascotas(@Body() dto: GetMascotasDto) { // devuelve todas las mascotas del cliente
        return this.clientService.getMascotas(dto);
    }
}
