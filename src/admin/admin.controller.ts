import { BadRequestException, Body, Controller, Get, HttpCode, 
        HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { UpdateReservacionDto } from 'src/client/dto';
import { Role, Roles, Usuario } from 'src/auth/decorator';
import { CreatePersonalDto, CreateClienteDto, CreateRazaDto, CreateMascotaDto, 
    UpdatePersonalDto, UpdateClienteDto, UpdateMascotaDto, UpdateUsuarioDto } from './dto';


@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(private readonly admService: AdminService) {}
    
    @HttpCode(HttpStatus.OK)
    @Get('testing') // $argon2id$v=19$m=16,t=2,p=1$ZzVuTmNJM0FNejFPc3Rzcg$xpurD+2skNn2yfW5q8SQHQ - admclaveingreso
    async getGreetings() {
        return 'Saludos desde la zona de administrador.';
    }

    @HttpCode(HttpStatus.OK)
    @Patch('reservacion')
    updateReservacion(
        @Body() dto: UpdateReservacionDto,
        @Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.admService.updateReservacion(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post(':tipoDeEntidad')
    async crearEntidad(
        @Body() dto: CreatePersonalDto | CreateClienteDto | CreateMascotaDto | CreateRazaDto,
        @Usuario() { userId, ip }: { userId: number; ip: string },
        @Param('tipoDeEntidad') tipoDeEntidad: string
    ) {
        const serviceMetodo = {
            personal: this.admService.crearPersonal,
            clientes: this.admService.crearCliente,
            mascotas: this.admService.crearMascota,
            raza: this.admService.crearRaza,
        }[tipoDeEntidad];

        if (!serviceMetodo) {
            throw new BadRequestException(`Tipo de entidad inválido: ${tipoDeEntidad}`);
        }
        return await serviceMetodo.call(this.admService, dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Get(':tipoDeEntidad')
    async leerEntidad(
        @Usuario() { userId, ip }: { userId: number; ip: string },
        @Param('tipoDeEntidad') tipoDeEntidad: string
    ) {
        const serviceMetodo = {
            personal: this.admService.getPersonal,
            clientes: this.admService.getClientes,
            mascotas: this.admService.getMascotas,
            logs: this.admService.getBitacoraLogs,
            reservacion: this.admService.getReservacionesGral,
            usuarios: this.admService.getUsuariosActivos,
            usuariosInactivos: this.admService.getUsuariosInactivos,
            raza: this.admService.getRazas,
            especie: this.admService.getEspecie
        }[tipoDeEntidad];

        if (!serviceMetodo) {
            throw new BadRequestException(`Tipo de entidad inválido: ${tipoDeEntidad}`);
        }
        return await serviceMetodo.call(this.admService, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':tipoDeEntidad')
    async actualizarEntidad(
        @Body() dto: UpdatePersonalDto | UpdateClienteDto | UpdateMascotaDto | UpdateUsuarioDto | UpdateUsuarioDto,
        @Usuario() { userId, ip }: { userId: number; ip: string },
        @Param('tipoDeEntidad') tipoDeEntidad: string
    ) {
        const serviceMetodo = {
            personal: this.admService.updatePersonal,
            clientes: this.admService.updateCliente,
            mascotas: this.admService.updateMascota,
            usuarios: this.admService.inhabilitarUsuario,
            usuariosInactivos: this.admService.habilitarUsuario,
        }[tipoDeEntidad];

        if (!serviceMetodo) {
            throw new BadRequestException(`Tipo de entidad inválido: ${tipoDeEntidad}`);
        }
        console.log({dto});
        return await serviceMetodo.call(this.admService, dto, userId, ip);
    }
}
