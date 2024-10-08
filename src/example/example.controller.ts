import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role, Roles } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';



@Controller('example')
@UseGuards(JwtGuard, RolesGuard)
export class ExampleController {
    @Get('admin')           // {{local}}/example/admin
    @Roles(Role.ADMIN)
    getAdminRoute() {
        return 'Bienvenido, Admin. Esta ruta es sólo para el administrador';
    }

    @Get('vetdoc')          // {{local}}/example/vetdoc
    @Roles(Role.VETDOC)
    getVetDocRoute() {
        return 'Bienvenido, Vet Doc. Esta ruta es sólo para el veterinario';
    }

    @Get('cliente')         // {{local}}/example/cliente
    @Roles(Role.CLIENT)
    getInternRoute() {
        return 'Bienvenido, Sr. Cliente. Esta ruta es sólo para clientes';
    }

    @Get('adm-cliente')     // {{local}}/example/adm-cliente
    @Roles(Role.ADMIN, Role.CLIENT)
    getVetDocInternRoute() {
        return 'Bienvenidos. Esta ruta es para administradores y clientes';
    }

    @Get('abierto')         // {{local}}/example/abierto
    getOpenRoute() {        // se puede ingresar a esta ruta sin ningún token
        return 'Bienvenidos. Esta ruta es abierta para todos.';
    }
}
