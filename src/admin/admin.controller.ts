import { BadRequestException, Body, Controller, Get, HttpCode, 
        HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role, Roles, Usuario } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { CreatePersonalDto, CreateClienteDto, CreateMascotaDto, 
        UpdatePersonalDto, UpdateClienteDto, UpdateMascotaDto } from './dto';
import { AdminService } from './admin.service';



@UseGuards(JwtGuard, RolesGuard)
@Controller('admin')
@Roles(Role.ADMIN)
export class AdminController {
    constructor(private readonly admService: AdminService) {}
    
    @HttpCode(HttpStatus.OK)
    @Get('testing')
    async getGreetings() {
        return 'Saludos desde la zona de administrador.';
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
            cliente: this.admService.crearCliente, // {{local}}/admin/cliente
            mascota: this.admService.crearMascota, // {{local}}/admin/mascota
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
            personal: this.admService.getPersonal, // {{local}}/admin/personal
            clientes: this.admService.getClientes, // {{local}}/admin/clientes
            mascotas: this.admService.getMascotas, // {{local}}/admin/mascotas
            logs: this.admService.getBitacoraLogs, // {{local}}/admin/logs
        }[tipoDeEntidad];

        if (!serviceMetodo) {
            throw new BadRequestException(`Tipo de entidad inválido: ${tipoDeEntidad}`);
        }

        return await serviceMetodo.call(this.admService, userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':tipoDeEntidad')
    async actualizarEntidad(
        @Body() dto: UpdatePersonalDto | UpdateClienteDto | UpdateMascotaDto,
        @Usuario() { userId, ip }: { userId: number; ip: string },
        @Param('tipoDeEntidad') tipoDeEntidad: string
    ) {
        const serviceMetodo = {
            personal: this.admService.updatePersonal, // {{local}}/admin/personal
            cliente: this.admService.updateCliente, // {{local}}/admin/cliente
            mascota: this.admService.updateMascota, // {{local}}/admin/mascota
        }[tipoDeEntidad];

        if (!serviceMetodo) {
            throw new BadRequestException(`Tipo de entidad inválido: ${tipoDeEntidad}`);
        }

        return await serviceMetodo.call(this.admService, dto, userId, ip);
    }
}
