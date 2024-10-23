import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { VetdocService } from './vetdoc.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Role, Roles, Usuario } from 'src/auth/decorator';
import { CreateRegvacDto } from './dto';


@UseGuards(JwtGuard, RolesGuard)
@Controller('vetdoc')
@Roles(Role.VETDOC)
export class VetdocController {
    constructor(private readonly vetdocService: VetdocService) {}

    @HttpCode(HttpStatus.OK)
    @Get('testing') // {{local}}/vetdoc/testing
    async getGreetings() {
        return 'Saludos desde la zona del matasanos.';
    }

    @HttpCode(HttpStatus.OK)
    @Post('regvac') // {{local}}/vetdoc/regvac
    async registrarVacuna(
        @Body() dto: CreateRegvacDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createRegVac(dto, userId, ip);
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('regvac/:mascotaID') // // {{local}}/vetdoc/regvac/id
    async leerRegistro(
        @Param('mascotaID') mascotaID: number,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.getRegVacMascota(mascotaID, userId, ip);
    }
}
