import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { VetdocService } from './vetdoc.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Role, Roles, Usuario } from 'src/auth/decorator';
import { CreateRegvacDto, CreateVacunaDto } from './dto';


@UseGuards(JwtGuard, RolesGuard)
@Controller('vetdoc')
@Roles(Role.VETDOC)
export class VetdocController {
    constructor(private readonly vetdocService: VetdocService) {}

    @HttpCode(HttpStatus.OK)
    @Get('testing')         // {{local}}/vetdoc/testing
    async getGreetings() {
        return '¡Saludos, desde la zona del matasanos!';
    }

    @HttpCode(HttpStatus.OK)
    @Post('vacunas')        // {{local}}/vetdoc/vacunas
    async registrarVacuna(
        @Body() dto: CreateVacunaDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createVacuna(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('vacunas')         // {{local}}/vetdoc/vacunas
    async leerVacunas(@Usuario() { userId, ip }: { userId: number; ip: string }) {
        return await this.vetdocService.getVacunas(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('regvac')         // {{local}}/vetdoc/regvac
    async registrarRegistroVacunacion(
        @Body() dto: CreateRegvacDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createRegVac(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('regvac')   // {{local}}/vetdoc/regvac
    async leerRegVac(@Usuario() { userId, ip }: { userId: number; ip: string }) {
        return await this.vetdocService.leerRegVac(userId, ip);
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('regvac/:mascotaID')   // {{local}}/vetdoc/regvac/id
    async leerRegVacMascota(
        @Param('mascotaID') mascotaID: number,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.leerRegVacMascota(mascotaID, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('reservaciones')    // {{local}}/vetdoc/reservaciones
    getReservacionesGral(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.getReservacionesGral(userId, ip);
    }

    
}
