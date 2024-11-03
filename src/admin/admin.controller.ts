import { BadRequestException, Body, Controller, Get, HttpCode, 
        HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CreatePersonalDto, CreateClienteDto, CreateMascotaDto, 
    UpdatePersonalDto, UpdateClienteDto, UpdateMascotaDto, 
    UpdateUsuarioDto} from './dto';
import { AdminService } from './admin.service';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { UpdateReservacionDto } from 'src/client/dto';
import { Role, Roles, Usuario } from 'src/auth/decorator';


@UseGuards(JwtGuard, RolesGuard)
@Controller('admin')
@Roles(Role.ADMIN)
export class AdminController {
    constructor(private readonly admService: AdminService) {}
    
    @HttpCode(HttpStatus.OK)
    @Get('testing') // $argon2id$v=19$m=16,t=2,p=1$ZzVuTmNJM0FNejFPc3Rzcg$xpurD+2skNn2yfW5q8SQHQ - admclaveingreso
    async getGreetings() {
        return 'Saludos desde la zona de administrador.';
    }

    @HttpCode(HttpStatus.OK)
    @Patch('reservacion')       // {{local}}/admin/reservacion
    updateReservacion(
        @Body() dto: UpdateReservacionDto,
        @Usuario() { userId, ip }: { userId: number, ip: string }) {
        console.log({userId, ip});
        return this.admService.updateReservacion(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('usuarios')       // {{local}}/admin/usuarios
    updateUsuario(
        @Body() dto: UpdateUsuarioDto,
        @Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.admService.updateUsuario(dto, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Post(':tipoDeEntidad')
    async crearEntidad(
        @Body() dto: CreatePersonalDto | CreateClienteDto | CreateMascotaDto,
        @Usuario() { userId, ip }: { userId: number; ip: string },
        @Param('tipoDeEntidad') tipoDeEntidad: string
    ) {
        const serviceMetodo = {
            personal: this.admService.crearPersonal, // {{local}}/admin/personal
            clientes: this.admService.crearCliente, // {{local}}/admin/clientes
            mascotas: this.admService.crearMascota, // {{local}}/admin/mascotas
        }[tipoDeEntidad];

        if (!serviceMetodo) {
            throw new BadRequestException(`Tipo de entidad inválido: ${tipoDeEntidad}`);
        }
        console.log({dto});
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
            usuarios: this.admService.getUsuarios
        }[tipoDeEntidad];

        if (!serviceMetodo) {
            throw new BadRequestException(`Tipo de entidad inválido: ${tipoDeEntidad}`);
        }
        console.log({userId, ip});
        return await serviceMetodo.call(this.admService, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':tipoDeEntidad')
    async actualizarEntidad(
        @Body() dto: UpdatePersonalDto | UpdateClienteDto | UpdateMascotaDto | UpdateUsuarioDto,
        @Usuario() { userId, ip }: { userId: number; ip: string },
        @Param('tipoDeEntidad') tipoDeEntidad: string
    ) {
        const serviceMetodo = {
            personal: this.admService.updatePersonal, // {{local}}/admin/personal
            clientes: this.admService.updateCliente, // {{local}}/admin/clientes
            mascotas: this.admService.updateMascota, // {{local}}/admin/mascotas
            usuarios: this.admService.updateUsuario, // {{local}}/admin/usuarios
        }[tipoDeEntidad];

        if (!serviceMetodo) {
            throw new BadRequestException(`Tipo de entidad inválido: ${tipoDeEntidad}`);
        }
        return await serviceMetodo.call(this.admService, dto, userId, ip);
    }
}
