import { Injectable } from '@nestjs/common';
import { format, parseISO } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';
import { BitacoraAccion, registrarEnBitacora } from 'src/utils/index.utils';
import { CreateAnalisisConsultaDto, CreateAnalisisInternacionDto, CreateCirugiaDto, CreateConsultaDto, 
    CreateInternacionDto, CreatePeluqueriaDto, CreateRecetaConsultaDto, CreateRecetaInternacionDto, CreateRegvacDto, 
    CreateReservacionCirugiaDto, CreateVacunaDto, UpdateCirugiaDto, UpdateConsultaDto, UpdateInternacionDto, UpdatePeluqeriaDto } from './dto';


@Injectable()
export class VetdocService {
    constructor(private prisma: PrismaService) {}

    async createVacuna(dto: CreateVacunaDto, userId: number, ipDir: string) {
        const result = await this.prisma.$transaction(async (prisma) => {
            await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearVacuna, ipDir);
            const vacuna = await prisma.vacuna.create({
                data: {
                    NombreVacuna: dto.NombreVacuna,
                    Descripcion: dto.Descripcion,
                    Laboratorio: dto.Laboratorio,
                    EdadMinima: dto.EdadMinima,
                    Tipo: dto.Tipo
                }
            });
            return vacuna;
        });
        return {
            Respuesta: "Vacuna registrada exitosamente.",
            VacunaID: result.VacunaID
        };
    }

    async createRegVac(dto: CreateRegvacDto, userId: number, ipDir: string) {
        const result = await this.prisma.$transaction(async (prisma) => {
            const regVac = await prisma.registrodevacunas.create({
                data: {
                    FechaVacunacion: parseISO(dto.FechaVacunacion.toISOString()),
                    ProximaFecha: parseISO(dto.ProximaFecha.toISOString()),
                    MascotaID: dto.MascotaID,
                    VacunaID: dto.VacunaID
                }
            });
            await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearRegVac, ipDir);
            return regVac;
        });
        return {
            Respuesta: "Vacunación registrada exitosamente.",
            RegvacID: result.RegistroID,
            MascotaID: result.MascotaID
        };
    }

    async createServPeluqueria(dto: CreatePeluqueriaDto, userId: number, ipDir: string) {
        try {
            const result = await this.prisma.$transaction(async (prisma) => {
                await prisma.reservacion.update({
                    where: { ReservacionID: dto.ReservacionID },
                    data: { Estado: 'Realizada' }
                });
                await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CerrarReservacion, ipDir);
                const servicio = await prisma.servicio.create({
                    data: {
                        TipoServicio: 'Peluqueria',
                        FechaHoraInicio: parseISO(new Date().toISOString()),
                        MascotaID: dto.MascotaID,
                        PersonalID: userId,
                        ReservacionID: dto.ReservacionID
                    }
                });
                const peluqueria = await prisma.peluqueria.create({
                    data: {
                        TipoCorte: dto.TipoCorte,
                        Lavado: dto.Lavado,
                        ServicioID: servicio.ServicioID
                    }
                });
                await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearServPeluqueria, ipDir);
                return {
                    servicio,
                    peluqueria
                };
            });
            return {
                Message: "Peluquería registrada exitosamente",
                ServicioID: result.servicio.ServicioID,
                PeluqueriaID: result.peluqueria.ID
            };
        } catch (error) {
            console.log(error);
        }
    }

    async createServConsulta(dto: CreateConsultaDto, userId: number, ipDir: string) {
        await this.prisma.reservacion.update({
            where: { ReservacionID: dto.ReservacionID },
            data: { Estado: 'Realizada' }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CerrarReservacion, ipDir);
        const servicio = await this.prisma.servicio.create({
            data: {
                TipoServicio: 'Consulta',
                FechaHoraInicio: parseISO(new Date().toISOString()),
                MascotaID: dto.MascotaID,
                PersonalID: userId,
                ReservacionID: dto.ReservacionID
            }
        });
        const consulta = await this.prisma.consultamedica.create({
            data: {
                Peso: dto.Peso,
                Temperatura: dto.Temperatura,
                ServicioID: servicio.ServicioID
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearServicioConsulta, ipDir);
        return {
            Message: "Consulta registrada exitosamente",
            ServicioID: servicio.ServicioID,
            ConsultaID: consulta.ID
        }
    }

    async createServInternacion(dto: CreateInternacionDto, userId: number, ipDir: string) {
        const servicio = await this.prisma.servicio.create({
            data: {
                TipoServicio: 'Internacion',
                FechaHoraInicio: parseISO(new Date().toISOString()),
                MascotaID: dto.MascotaID,
                PersonalID: userId,
            }
        });
        const internacion = await this.prisma.internacion.create({
            data: {
                PesoEntrada: dto.PesoEntrada,
                TemperaturaEntrada: dto.TemperaturaEntrada,
                NotasProgreso: dto.Notas,
                ServicioID: servicio.ServicioID,
                ConsultaID: dto.ConsultaID
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearServicioInternacion, ipDir);
        return {
            Message: "Internación registrada exitosamente",
            ServicioID: servicio.ServicioID,
            InternacionID: internacion.ID
        }
    }

    async createServCirugia(dto: CreateCirugiaDto, userId: number, ipDir: string) {
        await this.prisma.reservacion.update({
            where: { ReservacionID: dto.ReservacionID },
            data: { Estado: 'Realizada' }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CerrarReservacion, ipDir);
        const servicio = await this.prisma.servicio.create({
            data: {
                TipoServicio: 'Cirugia',
                FechaHoraInicio: parseISO(new Date().toISOString()),
                MascotaID: dto.MascotaID,
                PersonalID: userId,
                ReservacionID: dto.ReservacionID
            }
        });
        const cirugia = await this.prisma.cirugia.create({
            data: {
                PesoEntrada: dto.Peso,
                TemperaturaEntrada: dto.Temperatura,
                TipoDeCirugia: dto.TipoDeCirugia,
                Notas: dto.Notas,
                ServicioID: servicio.ServicioID
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearServicioCirugia, ipDir);
        return {
            Message: "Cirugía registrada exitosamente",
            ServicioID: servicio.ServicioID,
            CirugiaID: cirugia.ID
        }
    }

    async createAnalisisConsulta(dto: CreateAnalisisConsultaDto, userId: number, ipDir: string) {
        const fechaActual = new Date();
        const fechaModficada = format(fechaActual, 'yyyy-MM-dd');
        const analisis = await this.prisma.analisisclinico.create({
            data: {
                TipoAnalisis: dto.TipoAnalisis,
                FechaAnalisis: parseISO(fechaModficada),
                Resultado: dto.Resultado,
                ConsultaID: dto.ConsultaID,
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearAnalisis, ipDir);
        return {
            Message: "Análisis registrada exitosamente",
            RecetaID: analisis.ID
        }
    }

    async createAnalisisInternacion(dto: CreateAnalisisInternacionDto, userId: number, ipDir: string) {
        const fechaActual = new Date();
        const fechaModficada = format(fechaActual, 'yyyy-MM-dd');
        const analisis = await this.prisma.analisisclinico.create({
            data: {
                TipoAnalisis: dto.TipoAnalisis,
                FechaAnalisis: parseISO(fechaModficada),
                Resultado: dto.Resultado,
                InternacionID: dto.InternacionID,
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearAnalisis, ipDir);
        return {
            Message: "Análisis registrada exitosamente",
            RecetaID: analisis.ID
        }
    }

    async createRecetaConsulta(dto: CreateRecetaConsultaDto, userId: number, ipDir: string) {
        const receta = await this.prisma.receta.create({
            data: {
                Medicamento: dto.Medicamento,
                Dosis: dto.Dosis,
                Indicaciones: dto.Indicaciones,
                ConsultaID: dto.ConsultaID,
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CearReceta, ipDir);
        return {
            Message: "Receta registrada exitosamente",
            RecetaID: receta.ID
        }
    }

    async createRecetaInternacion(dto: CreateRecetaInternacionDto, userId: number, ipDir: string) {
        const receta = await this.prisma.receta.create({
            data: {
                Medicamento: dto.Medicamento,
                Dosis: dto.Dosis,
                Indicaciones: dto.Indicaciones,
                InternacionID: dto.InternacionID,
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CearReceta, ipDir);
        return {
            Message: "Receta registrada exitosamente",
            RecetaID: receta.ID
        }
    }

    async createReservacionCirugia(dto: CreateReservacionCirugiaDto, userId: number, ipDir: string) {
        const cliente = await this.prisma.cliente.findFirst({
            where: { NumeroCI: dto.CI }
        });
        const usuario = await this.prisma.usuario.findFirst({
            where: { ClienteID: cliente.ClienteID }
        })
        const reserva = await this.prisma.reservacion.create({
            data: {
                Motivo: "Cirugía",
                UsuarioID: usuario.UsuarioID,
                FechaHoraReservada: dto.FechaHoraReservada
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearReservacion, ipDir);
        return {
            Mensaje: "Reservación registrada exitosamente.",
            ReservaID: (await reserva).ReservacionID
        }
    }

    async getVacunas(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerVacuna, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                "VacunaID" AS "ID",
                "NombreVacuna" AS "Vacuna",
                "Descripcion",
                "Laboratorio",
                "Tipo",
                "EdadMinima"
            FROM "vacuna"
        `;    
    }

    // muestra las vacunaciones de una mascota en específico
    async leerRegVacMascota(mascotaID: number, userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerRegVac, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                m."Nombre" AS "Nombre",
                r."NombreRaza" AS "Raza",
                v."NombreVacuna" AS "Vacuna",
                reg."FechaVacunacion" AS "Fecha_De_Vacunacion",
                reg."ProximaFecha" AS "Proxima_Fecha"
            FROM "registrodevacunas" reg
            JOIN "mascota" m ON reg."MascotaID" = m."MascotaID"
            JOIN "vacuna" v ON reg."VacunaID" = v."VacunaID"
            JOIN "raza" r ON m."RazaID" = r."RazaID"
            WHERE m."MascotaID" = ${mascotaID};
        `;
    }

    // muestra todas las vacunaciones realizadas a mascotas
    async leerRegVac(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerRegVac, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                m."MascotaID",
                m."Nombre",
                r."NombreRaza" AS "Raza",
                v."NombreVacuna" AS "Vacuna",
                reg."FechaVacunacion" AS "Fecha_De_Vacunacion",
                reg."ProximaFecha" AS "Proxima_Fecha"
            FROM "registrodevacunas" reg
            JOIN "mascota" m ON reg."MascotaID" = m."MascotaID"
            JOIN "vacuna" v ON reg."VacunaID" = v."VacunaID"
            JOIN "raza" r ON m."RazaID" = r."RazaID";
        `;
    }

    async getMascotasCli(ClienteID: number, userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerMascota, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                m."MascotaID",
                m."Nombre"
            FROM mascota m
            JOIN cliente c ON m."ClienteID" = c."ClienteID"
            WHERE c."ClienteID" = ${ClienteID}
            ORDER BY m."MascotaID" ASC;
        `;
    }

    // muestra las reservaciones pendiente para atender
    async getReservacionesGral(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerReservacion, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                reservacion."ReservacionID",
                reservacion."Estado",
                reservacion."Motivo",
                TO_CHAR((reservacion."FechaHoraReservada"), 'YYYY-MM-DD HH24:MI:SS') AS "Hora",
                cliente."NombreCompleto" AS "Cliente",
                cliente."ClienteID" AS "ClienteID"
            FROM reservacion
            JOIN usuario ON reservacion."UsuarioID" = usuario."UsuarioID"
            JOIN cliente ON usuario."ClienteID" = cliente."ClienteID"
            WHERE reservacion."FechaHoraReservada" <= CURRENT_TIMESTAMP
            AND reservacion."Estado" = 'Pendiente'
            ORDER BY reservacion."FechaHoraReservada" DESC;
        `;
    }

    async getServiciosEnProceso(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerServPeluqueria, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                s."ServicioID",
                s."TipoServicio" AS "Servicio",
                CASE 
                    WHEN s."TipoServicio" = 'Consulta' THEN c."ID"
                    WHEN s."TipoServicio" = 'Internacion' THEN i."ID"
                    WHEN s."TipoServicio" = 'Cirugia' THEN cir."ID"
                    WHEN s."TipoServicio" = 'Peluqueria' THEN pel."ID"
                END as "ServicioEspecificoID",
                s."Estado",
                TO_CHAR((s."FechaHoraInicio"), 'YYYY-MM-DD HH24:MI:SS') AS "HoraInicio",
                m."Nombre" as "Mascota"
            FROM servicio s
            INNER JOIN mascota m ON s."MascotaID" = m."MascotaID"
            LEFT JOIN consultamedica c ON s."ServicioID" = c."ServicioID"
            LEFT JOIN internacion i ON s."ServicioID" = i."ServicioID"
            LEFT JOIN cirugia cir ON s."ServicioID" = cir."ServicioID"
            LEFT JOIN peluqueria pel ON s."ServicioID" = pel."ServicioID"
            WHERE s."Estado" = 'En Proceso'
            ORDER BY s."ServicioID" DESC;
        `;
    }

    async getServiciosCompletados(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerServiciosTerminados, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                s."ServicioID",
                s."TipoServicio" AS "Servicio",
                CASE 
                    WHEN s."TipoServicio" = 'Consulta' THEN c."ID"
                    WHEN s."TipoServicio" = 'Internacion' THEN i."ID"
                    WHEN s."TipoServicio" = 'Cirugia' THEN cir."ID"
                    WHEN s."TipoServicio" = 'Peluqueria' THEN pel."ID"
                END as "ServicioEspecificoID",
                s."Estado",
                TO_CHAR((s."FechaHoraFin"), 'YYYY-MM-DD HH24:MI:SS') AS "Hora de finalización",
                m."Nombre" AS "Nombre de Mascota"
            FROM "servicio" s
            JOIN "mascota" m ON s."MascotaID" = m."MascotaID"
            LEFT JOIN consultamedica c ON s."ServicioID" = c."ServicioID"
            LEFT JOIN internacion i ON s."ServicioID" = i."ServicioID"
            LEFT JOIN cirugia cir ON s."ServicioID" = cir."ServicioID"
            LEFT JOIN peluqueria pel ON s."ServicioID" = pel."ServicioID"
            WHERE s."Estado" = 'Completado'
            ORDER BY s."FechaHoraFin" DESC;
        `;
    }

    // muestra las consultas médicas terminadas para ser selecciondas a internacion:
    async getConsultasCompletadas(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerServicioConsulta, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                s."ServicioID",
                c."ID" as "ConsultaID",
                TO_CHAR((s."FechaHoraFin"), 'YYYY-MM-DD HH24:MI:SS') AS "Hora terminada",
                m."MascotaID",
                m."Nombre" as "Mascota",
                c."Peso",
                c."Temperatura"
            FROM servicio s
            INNER JOIN consultamedica c ON c."ServicioID" = s."ServicioID"
            INNER JOIN mascota m ON s."MascotaID" = m."MascotaID"
            LEFT JOIN internacion i ON i."ConsultaID" = c."ID"
            WHERE s."TipoServicio" = 'Consulta' 
            AND s."Estado" = 'Completado'
            AND i."ID" IS NULL
            ORDER BY c."ID" DESC;
        `;
    }

    async leerAnalisis(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerAnalisis, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                a."ID",
                a."TipoAnalisis",
                TO_CHAR((a."FechaAnalisis"), 'YYYY-MM-DD') AS "Fecha",
                a."Resultado",
                CASE 
                    WHEN a."ConsultaID" IS NOT NULL THEN 'Consulta'
                    WHEN a."InternacionID" IS NOT NULL THEN 'Internacion'
                END as "Servicio",
                COALESCE(a."ConsultaID", a."InternacionID") as "ServicioID",
                m."Nombre" as "Mascota",
                rz."NombreRaza" as "Raza"
            FROM analisisclinico a
            LEFT JOIN consultamedica c ON a."ConsultaID" = c."ID"
            LEFT JOIN servicio sc ON c."ServicioID" = sc."ServicioID"
            LEFT JOIN internacion i ON a."InternacionID" = i."ID"
            LEFT JOIN servicio si ON i."ServicioID" = si."ServicioID"
            LEFT JOIN mascota m ON COALESCE(sc."MascotaID", si."MascotaID") = m."MascotaID"
            LEFT JOIN raza rz ON m."RazaID" = rz."RazaID"
            ORDER BY a."ID" DESC;
        `;
    }

    async leerReceta(userId: number, ipDir: string) {
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.LeerReceta, ipDir);
        return this.prisma.$queryRaw`
            SELECT 
                r."ID",
                r."Medicamento",
                r."Dosis",
                r."Indicaciones",
                CASE 
                    WHEN r."ConsultaID" IS NOT NULL THEN 'Consulta'
                    WHEN r."InternacionID" IS NOT NULL THEN 'Internacion'
                END as "TipoServicio",
                COALESCE(r."ConsultaID", r."InternacionID") as "ServicioID",
                TO_CHAR((COALESCE(sc."FechaHoraFin", si."FechaHoraFin")), 'YYYY-MM-DD') AS "Fecha",
                m."Nombre" as "Mascota",
                rz."NombreRaza" as "Raza"
            FROM receta r
            LEFT JOIN consultamedica c ON r."ConsultaID" = c."ID"
            LEFT JOIN servicio sc ON c."ServicioID" = sc."ServicioID"
            LEFT JOIN internacion i ON r."InternacionID" = i."ID"
            LEFT JOIN servicio si ON i."ServicioID" = si."ServicioID"
            LEFT JOIN mascota m ON COALESCE(sc."MascotaID", si."MascotaID") = m."MascotaID"
            LEFT JOIN raza rz ON m."RazaID" = rz."RazaID"
            ORDER BY r."ID" DESC;
        `;
    }

    async updatePeluqueria(dto: UpdatePeluqeriaDto, userId: number, ipDir: string) {
        const servicio = await this.prisma.servicio.update({
            where: { ServicioID: dto.ServicioID },
            data: { Estado: 'Completado', FechaHoraFin: parseISO(new Date().toISOString()) }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.FinalizarServPeluqueria, ipDir);
        return {
            Respuesta : "Servicio completado",
            ServicioID : servicio.ServicioID
        }
    }

    async updateConsulta (dto: UpdateConsultaDto, userId: number, ipDir: string) {
        const servicio = await this.prisma.servicio.update({
            where: { ServicioID: dto.ServicioID },
            data: { Estado: 'Completado', FechaHoraFin: parseISO(new Date().toISOString()) }
        });
        await this.prisma.consultamedica.update({
            where: {ID: dto.ConsultaID},
            data: {
                Diagnostico: dto.Diagnostico,
                Tratamiento: dto.Tratamiento
            }
        })
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.FinalizarServicioConsulta, ipDir);
        return {
            Respuesta : "Servicio completado",
            ServicioID : servicio.ServicioID
        }
    }

    async updateServInternacion(dto: UpdateInternacionDto, userId: number, ipDir: string) {
        const servicio = await this.prisma.servicio.update({
            where: { ServicioID: dto.ServicioID },
            data: { Estado: 'Completado', FechaHoraFin: parseISO(new Date().toISOString()) }
        });
        await this.prisma.internacion.update({
            where: { ID: dto.InternacionID },
            data: { 
                PesoSalida: dto.PesoSalida,
                TemperaturaSalida: dto.TemperaturaSalida,
                NotasProgreso: dto.Notas
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.FinalizarServicioInternacion, ipDir);
        return {
            Respuesta : "Servicio completado",
            ServicioID : servicio.ServicioID
        }
    }

    async updateServCirugia(dto: UpdateCirugiaDto, userId: number, ipDir: string) {
        const servicio = await this.prisma.servicio.update({
            where: { ServicioID: dto.ServicioID },
            data: { Estado: 'Completado', FechaHoraFin: parseISO(new Date().toISOString()) }
        });
        await this.prisma.cirugia.update({
            where: { ID: dto.CirugiaID },
            data: {
                PesoSalida: dto.PesoSalida,
                TemperaturaSalida: dto.TemperaturaSalida,
                Notas: dto.Notas
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.FinalizarCirugia, ipDir);
        const nuevaInternacion = await this.prisma.servicio.create({
            data: {
                TipoServicio: 'Internacion',
                FechaHoraInicio: parseISO(new Date().toISOString()),
                MascotaID: dto.MascotaID,
                PersonalID: userId,
            }
        });
        await this.prisma.internacion.create({
            data: {
                PesoEntrada: dto.PesoSalida,
                TemperaturaEntrada: dto.TemperaturaSalida,
                NotasProgreso: dto.Notas,
                CirugiaID: dto.CirugiaID,
                ServicioID: nuevaInternacion.ServicioID
            }
        });
        await registrarEnBitacora(this.prisma, userId, BitacoraAccion.CrearServicioInternacion, ipDir);
        return {
            Respuesta : "Servicio completado",
            ServicioID : servicio.ServicioID
        }
    }
}
