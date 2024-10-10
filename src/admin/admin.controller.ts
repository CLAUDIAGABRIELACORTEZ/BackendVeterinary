import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { Role, Roles } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { CreateClienteDto, CreateMascotaDto, CreatePersonalDto } from './dto';
import { AdminService } from './admin.service';



@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
    constructor(private readonly admService: AdminService) {}
   
    @HttpCode(HttpStatus.OK)
    @Post('cliente')    // {{local}}/admin/cliente
    crearCliente(@Body() dto: CreateClienteDto) {
        return this.admService.crearCliente(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('personal')   // {{local}}/admin/personal
    crearPersonal(@Body() dto: CreatePersonalDto) {
        return this.admService.crearPersonal(dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('mascota')    // {{local}}/admin/mascota
    crearMascota(@Body() dto: CreateMascotaDto) {
        return this.admService.crearMascota(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('clientes/:id')    // {{local}}/admin/clientes
    getOneClient(@Param('id') id: string) { // devuelve al cliente con el id indicado, junto con sus mascotas
        return this.admService.getOneCliente(+id);
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('mascotas')    // {{local}}/admin/mascotas
    getMascotas() { // devuelve todas las mascotas, junto con sus dueños
        return this.admService.getMascotas();
    }

    @HttpCode(HttpStatus.OK)
    @Get('personal')    // {{local}}/admin/personal
    getPersonal() { // devuelve la lista del personal
        return this.admService.getPersonal();
    }
}
