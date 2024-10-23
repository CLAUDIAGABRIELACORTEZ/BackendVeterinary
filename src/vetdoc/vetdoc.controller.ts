import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { VetdocService } from './vetdoc.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Role, Roles, Usuario } from 'src/auth/decorator';


@Controller('vetdoc')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.VETDOC)
export class VetdocController {
    constructor(private readonly vetdocService: VetdocService) {}

    @HttpCode(HttpStatus.OK)
    @Get('testing') // {{local}}/vetdoc/testing
    async getGreetings() {
        return 'Saludos desde la zona del matasanos.';
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('regvac')
    async registrarVacuna(@Usuario() { userId, ip }: { userId: number; ip: string }) {
        return "Vacuna registrada";
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('regvac')
    async leerRegistroDeMascota(@Usuario() { userId, ip }: { userId: number; ip: string }) {
        return "Listado de vacunas";
    }
}
