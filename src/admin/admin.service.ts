import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClienteDto } from './dto/createCliente.dto';
import { CreateMascotaDto, CreatePersonalDto, GetPersonalDto } from './dto';
import * as argon from 'argon2';
import { usuario_Rol } from '@prisma/client';



@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService, 
                private jwt: JwtService,
                private config: ConfigService) {}

    async crearCliente(dto: CreateClienteDto) {
        const clienteRepetido = await this.prisma.cliente.findUnique({
            where: {
                Email: dto.Email,
            }
        });
        if (clienteRepetido) {
            throw new ForbiddenException('El correo ingresado ya existe en base de datos.');
        }
        const cliente = await this.prisma.cliente.create({
            data: {
                NombreCompleto: dto.NombreCompleto,
                Telefono: dto.Telefono,
                Direccion: dto.Direccion,
                Email: dto.Email
            }
        });
        const hashUsuario = await argon.hash('clientenuevo');
        const usuario = await this.prisma.usuario.create({
            data: {
                Rol: 'Cliente',
                PasswrdHash: hashUsuario,
                ClienteID: cliente.ClienteID,
                PersonalID: null
            }
        });
        return {
            "message": "Cliente registrado con éxito",
            "ClienteID": cliente.ClienteID,
            "UsuarioID": usuario.UsuarioID,
            // "plainText": hashUsuario,
            // "hash": usuario.PasswrdHash
        }
    }

    async crearPersonal(dto: CreatePersonalDto) {
        const personalRepetido = await this.prisma.personal.findUnique({
            where: {
                Email: dto.Email,
            }
        });
        if (personalRepetido) {
            throw new ForbiddenException('El correo ingresado ya existe en base de datos.');
        }
        if (dto.CargoID === 2) { // es veterinario, se le crea un perfil de usuario
            const personal = await this.prisma.personal.create({
                data: {
                    NombreCompleto: dto.NombreCompleto,
                    Telefono: dto.Telefono,
                    Direccion: dto.Direccion,
                    Email: dto.Email,
                    FechaContratacion: dto.FechaContratacion.toISOString(),
                    CargoID: dto.CargoID,
                    ProfesionID: dto.ProfesionID
                }
            });
            const hashPersonal = await argon.hash('personalnuevo');
            const usuario = await this.prisma.usuario.create({
                data: {
                    Rol: 'Veterinario',
                    PasswrdHash: hashPersonal,
                    PersonalID: personal.PersonalID,
                    ClienteID: null
                }
            });
            return {
                "message": "Personal registrado con éxito",
                "PersonalID": personal.PersonalID,
                "UsuarioID": usuario.UsuarioID,
                // "plainText": hashPersonal,
                // "hash": usuario.PasswrdHash
            }
        } else { // no es veterinario, no se le crea un perfil
            const personal = await this.prisma.personal.create({
                data: {
                    NombreCompleto: dto.NombreCompleto,
                    Telefono: dto.Telefono,
                    Direccion: dto.Direccion,
                    Email: dto.Email,
                    FechaContratacion: dto.FechaContratacion,
                    CargoID: dto.CargoID,
                    ProfesionID: dto.ProfesionID
                }
            });
            return {
                "message": "Personal registrado con éxito",
                "PersonalID": personal.PersonalID
            }
        }
    }

    async crearMascota(dto: CreateMascotaDto) {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                const mascota = await prisma.mascota.create({
                    data: {
                        Nombre: dto.Nombre,
                        Sexo: dto.Sexo,
                        FechaNacimiento: dto.FechaDeNacimiento,
                        Observaciones: dto.Observaciones,
                        RazaID: dto.RazaID,
                        ClienteID: dto.ClienteID
                    },
                });
      
                // Aquí se puede agregar más lógica para validaciones y registros en el futuro
                // Es problema del futuro yo
      
                return {
                    message: "Mascota registrada correctamente",
                    mascotaID: mascota.MascotaID,
                    propietarioID: mascota.ClienteID
                };
            });
      
            return result;
        } catch (error) {
            console.error('Error al crear la mascota:', error);
            throw new Error('No se pudo registrar la mascota. Las quejas con Rodrigo.');
        }
    }

    async getClientes() {
        return this.prisma.cliente.findMany({})
    }

    async getOneCliente(id: number) {
        return this.prisma.cliente.findUnique({
            where: {
                ClienteID: id
            },
            include: {
                mascotas: true
            }
        });
    }

    async getMascotas() {
        return await this.prisma.mascota.findMany({
            include: {
                cliente: true
            }
        });
    }

    async getPersonal() {
        return await this.prisma.personal.findMany();
    }
}
