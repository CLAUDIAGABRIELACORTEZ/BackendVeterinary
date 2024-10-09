import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
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
    
    @HttpCode(HttpStatus.OK)
    @Get('clientes/:id')    // {{local}}/admin/clientes
    @Roles(Role.ADMIN, Role.VETDOC)
    getOneClient(@Param('id') id: string) {
        return this.admService.getOneCliente(+id); // devuelve al cliente con el id indicado
    }
    
    @HttpCode(HttpStatus.OK)
    @Get('mascotas')    // {{local}}/admin/mascotas
    @Roles(Role.ADMIN, Role.VETDOC)
    getMascotas() {
        return this.admService.getMascotas();   // devuelve las mascotas con sus dueños
    }

    // @Get('vetdoc')
    // @Roles(Role.VETDOC)
    // getVetDocRoute() {
    //     return 'Esta ruta es sólo para el veterinario';
    // }

    // @Get('cliente')
    // @Roles(Role.CLIENT)
    // getInternRoute() {
    //     return 'Esta ruta es sólo para clientes';
    // }

    // @Get('adm-cliente')
    // @Roles(Role.ADMIN, Role.CLIENT)
    // getVetDocInternRoute() {
    //     return 'Esta ruta es para administrador y clientes';
    // }

}
