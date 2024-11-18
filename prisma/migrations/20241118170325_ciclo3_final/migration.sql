-- CreateEnum
CREATE TYPE "cargo_Cargo" AS ENUM ('Administrador', 'Medico', 'Laboratorista', 'Enfermero', 'Peluquero', 'Practicante');

-- CreateEnum
CREATE TYPE "servicio_TipoServicio" AS ENUM ('Consulta', 'Peluqueria', 'Internacion', 'Cirugia');

-- CreateEnum
CREATE TYPE "tipoaccionbitacora_Accion" AS ENUM ('Login', 'Logout', 'CrearProfesion', 'LeerProfesion', 'CrearPersonal', 'LeerPersonal', 'ActualizarPersonal', 'CrearCliente', 'LeerCliente', 'ActualizarCliente', 'LeerEspecie', 'CrearRaza', 'LeerRaza', 'CrearMascota', 'LeerMascota', 'ActualizarMascota', 'CrearReservacion', 'LeerReservacion', 'CancelarReservacion', 'CerrarReservacion', 'CrearVacuna', 'LeerVacuna', 'CrearRegVac', 'LeerRegVac', 'ActualizarRegVac', 'LeerUsuario', 'DesactivarUsuario', 'RehabilitarUsuario', 'CrearAnalisis', 'LeerAnalisis', 'ActualizarAnalisis', 'LeerReceta', 'CearReceta', 'ActualizarReceta', 'CrearServPeluqueria', 'LeerServPeluqueria', 'FinalizarServPeluqueria', 'CrearServicioConsulta', 'LeerServicioConsulta', 'ActualizarServicioConsulta', 'FinalizarServicioConsulta', 'CrearServicioCirugia', 'LeerServicioCirugia', 'ActualizarServicioCirugia', 'FinalizarCirugia', 'CrearServicioInternacion', 'LeerServicioInternacion', 'ActualizarServicioInternacion', 'FinalizarServicioInternacion', 'CrearRecibo', 'LeerRecibo', 'ActualizarRecibo', 'CrearDetalleRecibo', 'LeerDetalleRecibo', 'ActualizarDetalleRecibo', 'LeerServiciosEnProceso', 'LeerServiciosTerminados');

-- CreateEnum
CREATE TYPE "usuario_Rol" AS ENUM ('Administrador', 'Veterinario', 'Cliente');

-- CreateEnum
CREATE TYPE "servicio_Estado" AS ENUM ('En Proceso', 'Completado');

-- CreateEnum
CREATE TYPE "usuario_Estado" AS ENUM ('Activo', 'Inactivo');

-- CreateEnum
CREATE TYPE "reservacion_Estado" AS ENUM ('Pendiente', 'Cancelada', 'Realizada');

-- CreateEnum
CREATE TYPE "analisisclinico_Resultado" AS ENUM ('Normal', 'Bajo', 'Elevado', 'Bueno', 'Estable', 'Critico');

-- CreateEnum
CREATE TYPE "peluqueria_TipoCorte" AS ENUM ('Medio', 'Bajo', 'Alto', 'Especial');

-- CreateEnum
CREATE TYPE "vacuna_Tipo" AS ENUM ('Canina', 'Felina', 'Roedores', 'General');

-- CreateTable
CREATE TABLE "analisisclinico" (
    "ID" SERIAL NOT NULL,
    "TipoAnalisis" VARCHAR(100) NOT NULL,
    "FechaAnalisis" DATE NOT NULL,
    "Resultado" "analisisclinico_Resultado" DEFAULT 'Normal',
    "InternacionID" INTEGER,
    "ConsultaID" INTEGER,

    CONSTRAINT "analisisclinico_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "bitacora" (
    "BitacoraID" SERIAL NOT NULL,
    "UsuarioID" SMALLINT NOT NULL,
    "TipoAccionBitacoraID" SMALLINT NOT NULL,
    "FechaHora" TIMESTAMP(0) NOT NULL,
    "IPDir" INET NOT NULL,

    CONSTRAINT "bitacora_pkey" PRIMARY KEY ("BitacoraID")
);

-- CreateTable
CREATE TABLE "cargo" (
    "CargoID" SMALLSERIAL NOT NULL,
    "Cargo" "cargo_Cargo" NOT NULL DEFAULT 'Enfermero',

    CONSTRAINT "cargo_pkey" PRIMARY KEY ("CargoID")
);

-- CreateTable
CREATE TABLE "cirugia" (
    "ID" SERIAL NOT NULL,
    "TipoDeCirugia" VARCHAR(50) NOT NULL,
    "PesoEntrada" DECIMAL(6,2) NOT NULL,
    "TemperaturaEntrada" DECIMAL(6,2) NOT NULL,
    "PesoSalida" DECIMAL(6,2),
    "TemperaturaSalida" DECIMAL(6,2),
    "Notas" VARCHAR(500) NOT NULL,
    "ServicioID" INTEGER NOT NULL,

    CONSTRAINT "cirugia_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "cliente" (
    "ClienteID" SMALLSERIAL NOT NULL,
    "NombreCompleto" VARCHAR(60) NOT NULL,
    "Telefono" VARCHAR(30) NOT NULL,
    "NumeroCI" INTEGER NOT NULL,
    "Direccion" VARCHAR(100),
    "Email" VARCHAR(50) NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("ClienteID")
);

-- CreateTable
CREATE TABLE "consultamedica" (
    "ID" SERIAL NOT NULL,
    "Peso" DECIMAL(6,2) NOT NULL,
    "Temperatura" DECIMAL(6,2) NOT NULL,
    "Diagnostico" VARCHAR(200),
    "Tratamiento" VARCHAR(200),
    "ServicioID" INTEGER NOT NULL,

    CONSTRAINT "consultamedica_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "detallerecibo" (
    "ID" SERIAL NOT NULL,
    "ReciboID" INTEGER NOT NULL,
    "ServicioID" INTEGER,
    "Cantidad" INTEGER NOT NULL DEFAULT 1,
    "PrecioUnitario" DECIMAL(6,2) NOT NULL,
    "Subtotal" DECIMAL(8,2) NOT NULL,

    CONSTRAINT "detallerecibo_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "especie" (
    "EspecieID" SMALLSERIAL NOT NULL,
    "NombreEspecie" VARCHAR(20) NOT NULL,

    CONSTRAINT "especie_pkey" PRIMARY KEY ("EspecieID")
);

-- CreateTable
CREATE TABLE "internacion" (
    "ID" SERIAL NOT NULL,
    "NotasProgreso" VARCHAR(1500) NOT NULL,
    "PesoEntrada" DECIMAL(6,2) NOT NULL,
    "TemperaturaEntrada" DECIMAL(6,2) NOT NULL,
    "PesoSalida" DECIMAL(6,2),
    "TemperaturaSalida" DECIMAL(6,2),
    "ServicioID" INTEGER NOT NULL,
    "CirugiaID" INTEGER,
    "ConsultaID" INTEGER,

    CONSTRAINT "internacion_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "mascota" (
    "MascotaID" SMALLSERIAL NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Sexo" CHAR(1) NOT NULL,
    "FechaNacimiento" DATE NOT NULL,
    "Observaciones" VARCHAR(100),
    "ClienteID" SMALLINT NOT NULL,
    "RazaID" SMALLINT NOT NULL,

    CONSTRAINT "mascota_pkey" PRIMARY KEY ("MascotaID")
);

-- CreateTable
CREATE TABLE "peluqueria" (
    "ID" SERIAL NOT NULL,
    "TipoCorte" "peluqueria_TipoCorte" DEFAULT 'Medio',
    "Lavado" BOOLEAN NOT NULL,
    "ServicioID" INTEGER NOT NULL,

    CONSTRAINT "peluqueria_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "personal" (
    "PersonalID" SMALLSERIAL NOT NULL,
    "NombreCompleto" VARCHAR(60) NOT NULL,
    "NumeroCI" INTEGER NOT NULL,
    "Telefono" VARCHAR(30) NOT NULL,
    "Direccion" VARCHAR(100) NOT NULL,
    "FechaContratacion" DATE NOT NULL,
    "Activo" BOOLEAN NOT NULL DEFAULT true,
    "Email" VARCHAR(50) NOT NULL,
    "CargoID" SMALLINT NOT NULL,
    "ProfesionID" SMALLINT NOT NULL,

    CONSTRAINT "personal_pkey" PRIMARY KEY ("PersonalID")
);

-- CreateTable
CREATE TABLE "profesion" (
    "ProfesionID" SMALLSERIAL NOT NULL,
    "Profesion" VARCHAR(30) NOT NULL,

    CONSTRAINT "profesion_pkey" PRIMARY KEY ("ProfesionID")
);

-- CreateTable
CREATE TABLE "raza" (
    "RazaID" SMALLSERIAL NOT NULL,
    "NombreRaza" VARCHAR(50) NOT NULL,
    "EspecieID" SMALLINT NOT NULL,

    CONSTRAINT "raza_pkey" PRIMARY KEY ("RazaID")
);

-- CreateTable
CREATE TABLE "receta" (
    "ID" SERIAL NOT NULL,
    "Medicamento" VARCHAR(100) NOT NULL,
    "Dosis" VARCHAR(50) NOT NULL,
    "Indicaciones" VARCHAR(200) NOT NULL,
    "InternacionID" INTEGER,
    "ConsultaID" INTEGER,

    CONSTRAINT "receta_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "recibo" (
    "ID" SERIAL NOT NULL,
    "FechaEmision" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "recibo_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "registrodevacunas" (
    "RegistroID" SERIAL NOT NULL,
    "FechaVacunacion" DATE NOT NULL,
    "ProximaFecha" DATE,
    "VacunaID" SMALLINT NOT NULL,
    "MascotaID" SMALLINT NOT NULL,

    CONSTRAINT "registrodevacunas_pkey" PRIMARY KEY ("RegistroID")
);

-- CreateTable
CREATE TABLE "reservacion" (
    "ReservacionID" SERIAL NOT NULL,
    "Motivo" VARCHAR(80) NOT NULL,
    "FechaHoraReservada" TIMESTAMP(0) NOT NULL,
    "Estado" "reservacion_Estado" DEFAULT 'Pendiente',
    "UsuarioID" SMALLINT NOT NULL,

    CONSTRAINT "reservacion_pkey" PRIMARY KEY ("ReservacionID")
);

-- CreateTable
CREATE TABLE "servicio" (
    "ServicioID" SERIAL NOT NULL,
    "TipoServicio" "servicio_TipoServicio" NOT NULL,
    "Estado" "servicio_Estado" DEFAULT 'En Proceso',
    "FechaHoraInicio" TIMESTAMP(0) NOT NULL,
    "FechaHoraFin" TIMESTAMP(0),
    "ReservacionID" INTEGER,
    "MascotaID" SMALLINT NOT NULL,
    "PersonalID" SMALLINT NOT NULL,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("ServicioID")
);

-- CreateTable
CREATE TABLE "tipoaccionbitacora" (
    "TipoAccionBitacoraID" SMALLSERIAL NOT NULL,
    "Accion" "tipoaccionbitacora_Accion" NOT NULL,

    CONSTRAINT "tipoaccionbitacora_pkey" PRIMARY KEY ("TipoAccionBitacoraID")
);

-- CreateTable
CREATE TABLE "usuario" (
    "UsuarioID" SMALLSERIAL NOT NULL,
    "Rol" "usuario_Rol" NOT NULL DEFAULT 'Veterinario',
    "Estado" "usuario_Estado" NOT NULL DEFAULT 'Activo',
    "PasswrdHash" VARCHAR(256) NOT NULL,
    "CreatedAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP,
    "PersonalID" SMALLINT,
    "ClienteID" SMALLINT,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("UsuarioID")
);

-- CreateTable
CREATE TABLE "vacuna" (
    "VacunaID" SMALLSERIAL NOT NULL,
    "NombreVacuna" VARCHAR(50) NOT NULL,
    "Descripcion" VARCHAR(50) NOT NULL,
    "Laboratorio" VARCHAR(50) NOT NULL,
    "Tipo" "vacuna_Tipo" DEFAULT 'Canina',
    "EdadMinima" SMALLINT NOT NULL,

    CONSTRAINT "vacuna_pkey" PRIMARY KEY ("VacunaID")
);

-- CreateIndex
CREATE INDEX "analisisclinico_ConsultaID" ON "analisisclinico"("ConsultaID");

-- CreateIndex
CREATE INDEX "analisisclinico_InternacionID" ON "analisisclinico"("InternacionID");

-- CreateIndex
CREATE INDEX "TipoAccionBitacoraID" ON "bitacora"("TipoAccionBitacoraID");

-- CreateIndex
CREATE INDEX "bitacora_UsuarioID" ON "bitacora"("UsuarioID");

-- CreateIndex
CREATE INDEX "cirugia_ServicioID" ON "cirugia"("ServicioID");

-- CreateIndex
CREATE UNIQUE INDEX "UniqueClienteEmail" ON "cliente"("Email");

-- CreateIndex
CREATE INDEX "consultamedica_ServicioID" ON "consultamedica"("ServicioID");

-- CreateIndex
CREATE INDEX "ReciboID" ON "detallerecibo"("ReciboID");

-- CreateIndex
CREATE INDEX "detallerecibo_ServicioID" ON "detallerecibo"("ServicioID");

-- CreateIndex
CREATE UNIQUE INDEX "NombreEspecie" ON "especie"("NombreEspecie");

-- CreateIndex
CREATE INDEX "CirugiaID" ON "internacion"("CirugiaID");

-- CreateIndex
CREATE INDEX "internacion_ServicioID" ON "internacion"("ServicioID");

-- CreateIndex
CREATE INDEX "mascota_ClienteID" ON "mascota"("ClienteID");

-- CreateIndex
CREATE INDEX "RazaID" ON "mascota"("RazaID");

-- CreateIndex
CREATE INDEX "ServicioID" ON "peluqueria"("ServicioID");

-- CreateIndex
CREATE UNIQUE INDEX "UniquePersonalEmail" ON "personal"("Email");

-- CreateIndex
CREATE INDEX "CargoID" ON "personal"("CargoID");

-- CreateIndex
CREATE INDEX "ProfesionID" ON "personal"("ProfesionID");

-- CreateIndex
CREATE INDEX "EspecieID" ON "raza"("EspecieID");

-- CreateIndex
CREATE INDEX "ConsultaID" ON "receta"("ConsultaID");

-- CreateIndex
CREATE INDEX "InternacionID" ON "receta"("InternacionID");

-- CreateIndex
CREATE INDEX "registrodevacunas_MascotaID" ON "registrodevacunas"("MascotaID");

-- CreateIndex
CREATE INDEX "VacunaID" ON "registrodevacunas"("VacunaID");

-- CreateIndex
CREATE INDEX "UsuarioID" ON "reservacion"("UsuarioID");

-- CreateIndex
CREATE INDEX "MascotaID" ON "servicio"("MascotaID");

-- CreateIndex
CREATE INDEX "servicio_PersonalID" ON "servicio"("PersonalID");

-- CreateIndex
CREATE INDEX "ReservacionID" ON "servicio"("ReservacionID");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_PersonalID_key" ON "usuario"("PersonalID");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_ClienteID_key" ON "usuario"("ClienteID");

-- CreateIndex
CREATE INDEX "ClienteID" ON "usuario"("ClienteID");

-- CreateIndex
CREATE INDEX "PersonalID" ON "usuario"("PersonalID");

-- AddForeignKey
ALTER TABLE "analisisclinico" ADD CONSTRAINT "analisisclinico_InternacionID_fkey" FOREIGN KEY ("InternacionID") REFERENCES "internacion"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analisisclinico" ADD CONSTRAINT "analisisclinico_ConsultaID_fkey" FOREIGN KEY ("ConsultaID") REFERENCES "consultamedica"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bitacora" ADD CONSTRAINT "bitacora_UsuarioID_fkey" FOREIGN KEY ("UsuarioID") REFERENCES "usuario"("UsuarioID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bitacora" ADD CONSTRAINT "bitacora_TipoAccionBitacoraID_fkey" FOREIGN KEY ("TipoAccionBitacoraID") REFERENCES "tipoaccionbitacora"("TipoAccionBitacoraID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cirugia" ADD CONSTRAINT "cirugia_ServicioID_fkey" FOREIGN KEY ("ServicioID") REFERENCES "servicio"("ServicioID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultamedica" ADD CONSTRAINT "consultamedica_ServicioID_fkey" FOREIGN KEY ("ServicioID") REFERENCES "servicio"("ServicioID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detallerecibo" ADD CONSTRAINT "detallerecibo_ReciboID_fkey" FOREIGN KEY ("ReciboID") REFERENCES "recibo"("ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detallerecibo" ADD CONSTRAINT "detallerecibo_ServicioID_fkey" FOREIGN KEY ("ServicioID") REFERENCES "servicio"("ServicioID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internacion" ADD CONSTRAINT "internacion_ServicioID_fkey" FOREIGN KEY ("ServicioID") REFERENCES "servicio"("ServicioID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internacion" ADD CONSTRAINT "internacion_CirugiaID_fkey" FOREIGN KEY ("CirugiaID") REFERENCES "cirugia"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internacion" ADD CONSTRAINT "internacion_ConsultaID_fkey" FOREIGN KEY ("ConsultaID") REFERENCES "consultamedica"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mascota" ADD CONSTRAINT "mascota_ClienteID_fkey" FOREIGN KEY ("ClienteID") REFERENCES "cliente"("ClienteID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mascota" ADD CONSTRAINT "mascota_RazaID_fkey" FOREIGN KEY ("RazaID") REFERENCES "raza"("RazaID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peluqueria" ADD CONSTRAINT "peluqueria_ServicioID_fkey" FOREIGN KEY ("ServicioID") REFERENCES "servicio"("ServicioID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal" ADD CONSTRAINT "personal_CargoID_fkey" FOREIGN KEY ("CargoID") REFERENCES "cargo"("CargoID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal" ADD CONSTRAINT "personal_ProfesionID_fkey" FOREIGN KEY ("ProfesionID") REFERENCES "profesion"("ProfesionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raza" ADD CONSTRAINT "raza_EspecieID_fkey" FOREIGN KEY ("EspecieID") REFERENCES "especie"("EspecieID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receta" ADD CONSTRAINT "receta_InternacionID_fkey" FOREIGN KEY ("InternacionID") REFERENCES "internacion"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receta" ADD CONSTRAINT "receta_ConsultaID_fkey" FOREIGN KEY ("ConsultaID") REFERENCES "consultamedica"("ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrodevacunas" ADD CONSTRAINT "registrodevacunas_VacunaID_fkey" FOREIGN KEY ("VacunaID") REFERENCES "vacuna"("VacunaID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrodevacunas" ADD CONSTRAINT "registrodevacunas_MascotaID_fkey" FOREIGN KEY ("MascotaID") REFERENCES "mascota"("MascotaID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservacion" ADD CONSTRAINT "reservacion_UsuarioID_fkey" FOREIGN KEY ("UsuarioID") REFERENCES "usuario"("UsuarioID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_ReservacionID_fkey" FOREIGN KEY ("ReservacionID") REFERENCES "reservacion"("ReservacionID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_MascotaID_fkey" FOREIGN KEY ("MascotaID") REFERENCES "mascota"("MascotaID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_PersonalID_fkey" FOREIGN KEY ("PersonalID") REFERENCES "personal"("PersonalID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_PersonalID_fkey" FOREIGN KEY ("PersonalID") REFERENCES "personal"("PersonalID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_ClienteID_fkey" FOREIGN KEY ("ClienteID") REFERENCES "cliente"("ClienteID") ON DELETE SET NULL ON UPDATE CASCADE;
