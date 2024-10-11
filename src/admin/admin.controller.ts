import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role, Roles } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreateClienteDto, CreateMascotaDto, CreatePersonalDto, GetQueryDto, UpdateClienteDto, UpdateMascotaDto, UpdatePersonalDto } from './dto';
import { AdminService } from './admin.service';

// $argon2id$v=19$m=16,t=2,p=1$ZzVuTmNJM0FNejFPc3Rzcg$xpurD+2skNn2yfW5q8SQHQ - admclaveingreso
// adm@stmateo.com.bo

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
export class AdminController {
    constructor(private readonly admService: AdminService) {}

    @HttpCode(HttpStatus.OK)
    @Post('personal')   // {{local}}/admin/personal
    @Roles(Role.ADMIN)
    async crearPersonal(@Body() dto: CreatePersonalDto) {
        return await this.admService.crearPersonal(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('cliente')    // {{local}}/admin/cliente
    @Roles(Role.ADMIN)
    async crearCliente(@Body() dto: CreateClienteDto) {
        return await this.admService.crearCliente(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('mascota')    // {{local}}/admin/mascota
    @Roles(Role.ADMIN)
    async crearMascota(@Body() dto: CreateMascotaDto) {
        return await this.admService.crearMascota(dto);
    }
    
    // @HttpCode(HttpStatus.OK)
    // @Get('clientes/:id')    // {{local}}/admin/clientes
    // getOneClient(@Param('id') id: string) { // devuelve al cliente con el id indicado, junto con sus mascotas
    //     return this.admService.getOneCliente(+id);
    // }

    @HttpCode(HttpStatus.OK)
    @Get('personal')    // {{local}}/admin/personal
    @Roles(Role.ADMIN)
    async getPersonal(@Body() dto: GetQueryDto) { // devuelve la lista del personal
        return await this.admService.getPersonal(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('clientes')    // {{local}}/admin/clientes
    @Roles(Role.ADMIN)
    async getClientes(@Body() dto: GetQueryDto) {
        return await this.admService.getClientes(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('mascotas')    // {{local}}/admin/mascotas
    @Roles(Role.ADMIN)
    async getMascotas(@Body() dto: GetQueryDto) { // devuelve todas las mascotas, junto con sus dueños
        return await this.admService.getMascotas(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('personal')   // {{local}}/admin/personal
    @Roles(Role.ADMIN)
    async updatePersonal(@Body() dto: UpdatePersonalDto) {
        return await this.admService.updatePersonal(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Patch('cliente')   // {{local}}/admin/cliente
    @Roles(Role.ADMIN)
    async updateCliente(@Body() dto: UpdateClienteDto) {
        return await this.admService.updateCliente(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Patch('mascota')   // {{local}}/admin/mascota
    @Roles(Role.ADMIN)
    async updateMascota(@Body() dto: UpdateMascotaDto) {
        return await this.admService.updateMascota(dto);
    }
}
