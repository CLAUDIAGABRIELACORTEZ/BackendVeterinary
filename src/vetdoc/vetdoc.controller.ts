import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { VetdocService } from './vetdoc.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Role, Roles, Usuario } from 'src/auth/decorator';
import { CreateAnalisisConsultaDto, CreateConsultaDto, CreateInternacionDto, CreatePeluqueriaDto, CreateRecetaConsultaDto, 
    CreateRegvacDto, CreateVacunaDto, UpdateConsultaDto, UpdateInternacionDto, UpdateServicioDto } from './dto';


@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.VETDOC)
@Controller('vetdoc')
export class VetdocController {
    constructor(private readonly vetdocService: VetdocService) {}

    @HttpCode(HttpStatus.OK)
    @Get('testing')                     // {{local}}/vetdoc/testing
    async getGreetings() {
        return '¡Saludos, desde la zona del matasanos!';
    }

    @HttpCode(HttpStatus.OK)
    @Post('vacunas')                    // {{local}}/vetdoc/vacunas
    async registrarVacuna(
        @Body() dto: CreateVacunaDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createVacuna(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('vacunas')                     // {{local}}/vetdoc/vacunas
    async leerVacunas(@Usuario() { userId, ip }: { userId: number; ip: string }) {
        return await this.vetdocService.getVacunas(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('regvac')                     // {{local}}/vetdoc/regvac
    async registrarRegistroVacunacion(
        @Body() dto: CreateRegvacDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createRegVac(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('regvac')                      // {{local}}/vetdoc/regvac
    async leerRegVac(@Usuario() { userId, ip }: { userId: number; ip: string }) {
        return await this.vetdocService.leerRegVac(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('regvac/:mascotaID')           // {{local}}/vetdoc/regvac/id
    async leerRegVacMascota(
        @Param('mascotaID') mascotaID: number,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.leerRegVacMascota(mascotaID, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('reservaciones')               // {{local}}/vetdoc/reservaciones
    getReservacionesGral(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.getReservacionesGral(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('servicios/peluqueria')
    async createServPeluqueria(
        @Body() dto: CreatePeluqueriaDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createServPeluqueria(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('servicios/consulta')
    async createServConsulta(
        @Body() dto: CreateConsultaDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        console.log("****************************************************");
        console.log("CREAR CONSULTA:");
        console.log({dto});
        console.log("****************************************************");
        return await this.vetdocService.createServConsulta(dto, userId, ip);
    }
    
    @HttpCode(HttpStatus.OK)
    @Patch('servicios/consulta')
    async updateConsulta(
        @Body() dto: UpdateConsultaDto,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        console.log("****************************************************");
        console.log("FINALIZAR CONSULTA:");
        console.log({dto});
        console.log("****************************************************");
        return await this.vetdocService.updateConsulta(dto, userId, ip);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('servicios/internacion')
    async createServInternacion(
        @Body() dto: CreateInternacionDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        console.log("****************************************************");
        console.log("CREAR INTERNACION:");
        console.log({dto});
        console.log("****************************************************");
        return await this.vetdocService.createServInternacion(dto, userId, ip);
    }
    
    @HttpCode(HttpStatus.OK)
    @Patch('servicios/internacion')
    async updateServInternacion(
        @Body() dto: UpdateInternacionDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        console.log("****************************************************");
        console.log("FINALIZAR INTERNACION:");
        console.log({dto});
        console.log("****************************************************");
        return await this.vetdocService.updateServInternacion(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('receta/consulta')
    async createReceta(
        @Body() dto: CreateRecetaConsultaDto,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        console.log("****************************************************");
        console.log("CREAR RECETA-CONSULTA:");
        console.log({dto});
        console.log("****************************************************");
        return await this.vetdocService.createRecetaConsulta(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('receta')
    async leerReceta(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.leerReceta(userId, ip);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('analisis/consulta')
    async createAnalisis(
        @Body() dto: CreateAnalisisConsultaDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        console.log("****************************************************");
        console.log("CREAR ANALISIS-CONSULTA:");
        console.log({dto});
        console.log("****************************************************");
        return await this.vetdocService.createAnalisis(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('analisis')
    async leerAnalisis(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.leerAnalisis(userId, ip);
    }


    // ***************************************************************************************************
    // ***************************************************************************************************
    // ***************************************************************************************************


    @HttpCode(HttpStatus.OK)
    @Get('servicios/active')            // {{local}}/vetdoc/servicios/active
    getServiciosEnProceso(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.getServiciosEnProceso(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('servicios/consulta')          // {{local}}/vetdoc/servicios/active
    getConsultasCompletadas(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.getConsultasCompletadas(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('servicios/completed')         // {{local}}/vetdoc/servicios/completed
    getServiciosCompletados(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.getServiciosCompletados(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('mascotas/:ClienteID')         // {{local}}/vetdoc/mascotas/:ClienteID
    async leerMascotaCli(
        @Param('ClienteID') ClienteID: number,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.getMascotasCli(ClienteID, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('servicios')                 // {{local}}/vetdoc/servicios
    updateServicio(
        @Body() dto: UpdateServicioDto,
        @Usuario() { userId, ip }: { userId: number, ip: string }) {
        console.log({dto});
        return this.vetdocService.updateServicio(dto, userId, ip);
    }
}
