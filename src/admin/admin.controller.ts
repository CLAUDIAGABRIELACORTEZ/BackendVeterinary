import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role, Roles } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreateClienteDto, CreateMascotaDto, CreatePersonalDto } from './dto';
import { AdminService } from './admin.service';



@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
export class AdminController {
    constructor(private readonly admService: AdminService) {}
    
    @HttpCode(HttpStatus.OK)
    @Post('cliente')    // {{local}}/admin/cliente
    @Roles(Role.ADMIN)
    crearCliente(@Body() dto: CreateClienteDto) {
        return this.admService.crearCliente(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('personal')   // {{local}}/admin/personal
    @Roles(Role.ADMIN)
    crearPersonal(@Body() dto: CreatePersonalDto) {
        return this.admService.crearPersonal(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Post('mascota')    // {{local}}/admin/mascota
    @Roles(Role.ADMIN)
    crearMascota(@Body() dto: CreateMascotaDto) {
        return this.admService.crearMascota(dto);
    }
    
    // @HttpCode(HttpStatus.OK)
    // @Get('clientes/:id')    // {{local}}/admin/clientes
    // getOneClient(@Param('id') id: string) { // devuelve al cliente con el id indicado, junto con sus mascotas
    //     return this.admService.getOneCliente(+id);
    // }
    
    @HttpCode(HttpStatus.OK)
    @Get('clientes')    // {{local}}/admin/clientes
    @Roles(Role.ADMIN)
    getClientes() { // devuelve a los clientes, junto con sus mascotas
        return this.admService.getClientes();
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('mascotas')    // {{local}}/admin/mascotas
    @Roles(Role.ADMIN)
    getMascotas() { // devuelve todas las mascotas, junto con sus dueños
        return this.admService.getMascotas();
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('personal')    // {{local}}/admin/personal
    @Roles(Role.ADMIN)
    getPersonal() { // devuelve la lista del personal
        return this.admService.getPersonal();
    }
    
    @Patch('cliente')
    @Roles(Role.ADMIN)
    updateCliente() {
        
    }
    
    @Patch('mascota')
    @Roles(Role.ADMIN)
    updateMascota() {
        
    }
    
    @Patch('usuario')
    @Roles(Role.ADMIN)
    updateUsuario() {
        
    }
}
