import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando seed...');

    // Crear los cargos
    const administradorCargo = await prisma.cargo.create({
        data: {
            Cargo: 'Administrador',
        },
    });

    console.log(`Cargo creado: ${administradorCargo.Cargo}`);

    // Crear la profesión
    const administradorProfesion = await prisma.profesion.create({
        data: {
            Profesion: 'Administrador',
        },
    });

    console.log(`Profesión creada: ${administradorProfesion.Profesion}`);

    // Crear los tipos de acciones para la bitácora
    const accionesBitacora = [
        'Login',
        'Logout',
        'CrearProfesion',
        'LeerProfesion',
        'CrearPersonal',
        'LeerPersonal',
        'ActualizarPersonal',
        'CrearCliente',
        'LeerCliente',
        'ActualizarCliente',
        'LeerEspecie',
        'CrearRaza',
        'LeerRaza',
        'CrearMascota',
        'LeerMascota',
        'ActualizarMascota',
        'CrearReservacion',
        'LeerReservacion',
        'CancelarReservacion',
        'CerrarReservacion',
        'CrearVacuna',
        'LeerVacuna',
        'CrearRegVac',
        'LeerRegVac',
        'ActualizarRegVac',
        'LeerUsuario',
        'DesactivarUsuario',
        'RehabilitarUsuario',
        'CrearAnalisis',
        'LeerAnalisis',
        'ActualizarAnalisis',
        'LeerReceta',
        'CearReceta', // Fíjate que está como "CearReceta" en el enum
        'ActualizarReceta',
        'CrearServPeluqueria',
        'LeerServPeluqueria',
        'FinalizarServPeluqueria',
        'CrearServicioConsulta',
        'LeerServicioConsulta',
        'ActualizarServicioConsulta',
        'FinalizarServicioConsulta',
        'CrearServicioCirugia',
        'LeerServicioCirugia',
        'ActualizarServicioCirugia',
        'FinalizarCirugia',
        'CrearServicioInternacion',
        'LeerServicioInternacion',
        'ActualizarServicioInternacion',
        'FinalizarServicioInternacion',
        'CrearRecibo',
        'LeerRecibo',
        'ActualizarRecibo',
        'CrearDetalleRecibo',
        'LeerDetalleRecibo',
        'ActualizarDetalleRecibo',
        'LeerServiciosEnProceso',
        'LeerServiciosTerminados',
    ] as const;

    for (const accion of accionesBitacora) {
        await prisma.tipoaccionbitacora.create({
            data: { Accion: accion },
        });
    }

    console.log('Tipos de acción para la bitácora creados.');

    // Crear un usuario administrador
    const existingAdmin = await prisma.usuario.findFirst({
        where: { Rol: 'Administrador' },
    });

    if (!existingAdmin) {
        console.log('Creando usuario administrador...');

        const hashedPassword = await argon2.hash('admin123');

        const personalAdmin = await prisma.personal.create({
            data: {
                NombreCompleto: 'Admin Principal',
                NumeroCI: 12345678,
                Telefono: '123456789',
                Direccion: 'Dirección del Admin',
                FechaContratacion: new Date(),
                Email: 'admin@example.com',
                CargoID: administradorCargo.CargoID,
                ProfesionID: administradorProfesion.ProfesionID,
            },
        });

        await prisma.usuario.create({
            data: {
                Rol: 'Administrador',
                Estado: 'Activo',
                PasswrdHash: hashedPassword,
                PersonalID: personalAdmin.PersonalID,
            },
        });

        console.log('Usuario administrador creado con éxito.');
    } else {
        console.log('Ya existe un usuario administrador, no se creó uno nuevo.');
    }

    console.log('Seed completado.');
}

main()
    .catch((e) => {
        console.error('Error durante el seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
