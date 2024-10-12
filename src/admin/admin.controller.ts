import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role, Roles, Usuario } from 'src/auth/decorator';
import { JwtGuard, RolesGuard } from 'src/auth/guard';
import { CreatePersonalDto, CreateClienteDto, CreateMascotaDto, 
        UpdatePersonalDto, UpdateClienteDto, UpdateMascotaDto } from './dto';
import { AdminService } from './admin.service';



@UseGuards(JwtGuard, RolesGuard)
@Controller('admin') // admclaveingreso
export class AdminController {
    constructor(private readonly admService: AdminService) {}

    @HttpCode(HttpStatus.OK)
    @Post('personal')   // {{local}}/admin/personal
    @Roles(Role.ADMIN)
    async crearPersonal(@Body() dto: CreatePersonalDto, @Usuario() userId: number) {
        return await this.admService.crearPersonal(dto, userId);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('cliente')    // {{local}}/admin/cliente
    @Roles(Role.ADMIN)
    async crearCliente(@Body() dto: CreateClienteDto, @Usuario() userId: number) {
        return await this.admService.crearCliente(dto, userId);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('mascota')    // {{local}}/admin/mascota
    @Roles(Role.ADMIN)
    async crearMascota(@Body() dto: CreateMascotaDto, @Usuario() userId: number) {
        return await this.admService.crearMascota(dto, userId);
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('personal') // {{local}}/admin/clientes
    @Roles(Role.ADMIN)
    async getPersonal(@Usuario() userId: number) {
        return await this.admService.getPersonal(userId); // Envías solo el token al servicio
    }

    @HttpCode(HttpStatus.OK)
    @Get('clientes') // {{local}}/admin/clientes
    @Roles(Role.ADMIN)
    async getClientes(@Usuario() userId: number) {
        return await this.admService.getClientes(userId);
    }

    @HttpCode(HttpStatus.OK)
    @Get('mascotas') // {{local}}/admin/mascotas
    @Roles(Role.ADMIN)
    async GetMascotas(@Usuario() userId: number) {
        return await this.admService.getMascotas(userId);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('personal')   // {{local}}/admin/personal
    @Roles(Role.ADMIN)
    async updatePersonal(@Body() dto: UpdatePersonalDto, @Usuario() userId: number) {
        return await this.admService.updatePersonal(dto, userId);
    }
   
    @HttpCode(HttpStatus.OK)
    @Patch('cliente')   // {{local}}/admin/cliente
    @Roles(Role.ADMIN)
    async updateCliente(@Body() dto: UpdateClienteDto, @Usuario() userId: number) {
        return await this.admService.updateCliente(dto, userId);
    }
    
    @HttpCode(HttpStatus.OK)
    @Patch('mascota')   // {{local}}/admin/mascota
    @Roles(Role.ADMIN)
    async updateMascota(@Body() dto: UpdateMascotaDto, @Usuario() userId: number) {
        return await this.admService.updateMascota(dto, userId);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('testing')   // {{local}}/admin/mascota
    @Roles(Role.ADMIN)
    async getGreetings() {
        return 'El permiso de Admin funciona.';
    }
}
