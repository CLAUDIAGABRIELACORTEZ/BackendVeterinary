import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { VetdocService } from './vetdoc.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { Role, Roles, Usuario } from 'src/auth/decorator';
import { CreateAnalisisConsultaDto, CreateAnalisisInternacionDto, CreateCirugiaDto, CreateConsultaDto, CreateInternacionDto, 
    CreatePeluqueriaDto, CreateRecetaConsultaDto, CreateRecetaInternacionDto, CreateRegvacDto, CreateReservacionCirugiaDto, CreateVacunaDto, UpdateCirugiaDto, 
    UpdateConsultaDto, UpdateInternacionDto, UpdatePeluqeriaDto } from './dto';


@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.VETDOC)
@Controller('vetdoc')
export class VetdocController {
    constructor(private readonly vetdocService: VetdocService) {}

    @HttpCode(HttpStatus.OK)
    @Post('vacunas')
    async registrarVacuna(
        @Body() dto: CreateVacunaDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createVacuna(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('regvac')
    async registrarRegistroVacunacion(
        @Body() dto: CreateRegvacDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createRegVac(dto, userId, ip);
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
        return await this.vetdocService.createServConsulta(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('servicios/internacion')
    async createServInternacion(
        @Body() dto: CreateInternacionDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createServInternacion(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('servicios/cirugia')
    async createServCirugia(
        @Body() dto: CreateCirugiaDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createServCirugia(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('analisis/consulta')
    async createAnalisisConsulta(
        @Body() dto: CreateAnalisisConsultaDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createAnalisisConsulta(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('analisis/internacion')
    async createAnalisisInternacion(
        @Body() dto: CreateAnalisisInternacionDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createAnalisisInternacion(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('receta/consulta')
    async createRecetaConsulta(
        @Body() dto: CreateRecetaConsultaDto,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createRecetaConsulta(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('receta/internacion')
    async createRecetaInternacion(
        @Body() dto: CreateRecetaInternacionDto,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.createRecetaInternacion(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post('reservacion')
    async createReservacionCirugia(
        @Body() dto: CreateReservacionCirugiaDto,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        console.log({dto});
        return await this.vetdocService.createReservacionCirugia(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('vacunas')
    async leerVacunas(@Usuario() { userId, ip }: { userId: number; ip: string }) {
        return await this.vetdocService.getVacunas(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('regvac/:mascotaID')
    async leerRegVacMascota(
        @Param('mascotaID') mascotaID: number,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.leerRegVacMascota(mascotaID, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('regvac')
    async leerRegVac(@Usuario() { userId, ip }: { userId: number; ip: string }) {
        return await this.vetdocService.leerRegVac(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('mascotas/:ClienteID')
    async leerMascotaCli(
        @Param('ClienteID') ClienteID: number,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.getMascotasCli(ClienteID, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('reservaciones')
    getReservacionesGral(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.getReservacionesGral(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('servicios/active')
    getServiciosEnProceso(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.getServiciosEnProceso(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('servicios/completed')
    getServiciosCompletados(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.getServiciosCompletados(userId, ip);
    }

    @Get('servicios/consulta')
    getConsultasCompletadas(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.getConsultasCompletadas(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('analisis')
    async leerAnalisis(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.leerAnalisis(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get('receta')
    async leerReceta(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.leerReceta(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('servicios/peluqueria')
    updatePeluqueria(
        @Body() dto: UpdatePeluqeriaDto,
        @Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.vetdocService.updatePeluqueria(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('servicios/consulta')
    async updateConsulta(
        @Body() dto: UpdateConsultaDto,
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.updateConsulta(dto, userId, ip);
    }
    
    @HttpCode(HttpStatus.OK)
    @Patch('servicios/internacion')
    async updateServInternacion(
        @Body() dto: UpdateInternacionDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.updateServInternacion(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('servicios/cirugia')
    async updateServCirugia(
        @Body() dto: UpdateCirugiaDto, 
        @Usuario() { userId, ip }: { userId: number; ip: string }
    ) {
        return await this.vetdocService.updateServCirugia(dto, userId, ip);
    }
}
