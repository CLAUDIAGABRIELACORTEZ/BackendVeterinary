/*
  Warnings:

  - The values [ActualizarReservacion,ActualizarUsuario] on the enum `tipoaccionbitacora_Accion` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `ReservacionID` on table `servicio` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "tipoaccionbitacora_Accion_new" AS ENUM ('Login', 'Logout', 'CrearProfesion', 'LeerProfesion', 'CrearPersonal', 'ListarPersonal', 'ActualizarPersonal', 'CrearCliente', 'ListarClientes', 'ActualizarCliente', 'CrearRaza', 'LeerRaza', 'CrearMascota', 'ListarMascotas', 'ActualizarMascota', 'CrearReservacion', 'ListarReservacion', 'CancelarReservacion', 'CrearVacuna', 'ListarVacunas', 'CrearRegVac', 'ListarRegVac', 'ActualizarRegVac', 'ListarUsuarios', 'ActualizarUsuarios', 'CrearServicio', 'LeerServicio', 'ActualizarServicio', 'CrearPeluqueria', 'LeerPeluqueria', 'ActualizarPeluqueria', 'CearReceta', 'LeerReceta', 'ActualizarReceta', 'CrearAnalisis', 'LeerAnalisis', 'ActualizarAnalisis', 'CrearConsulta', 'LeerConsulta', 'ActualizarConsulta', 'CrearInternacion', 'LeerInternacion', 'ActualizarInternacion', 'CrearCirugia', 'LeerCirugua', 'ActualizarCirugia');
ALTER TABLE "tipoaccionbitacora" ALTER COLUMN "Accion" TYPE "tipoaccionbitacora_Accion_new" USING ("Accion"::text::"tipoaccionbitacora_Accion_new");
ALTER TYPE "tipoaccionbitacora_Accion" RENAME TO "tipoaccionbitacora_Accion_old";
ALTER TYPE "tipoaccionbitacora_Accion_new" RENAME TO "tipoaccionbitacora_Accion";
DROP TYPE "tipoaccionbitacora_Accion_old";
COMMIT;

-- AlterTable
ALTER TABLE "servicio" ALTER COLUMN "ReservacionID" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "consultamedica" ADD CONSTRAINT "consultamedica_ServicioID_fkey" FOREIGN KEY ("ServicioID") REFERENCES "servicio"("ServicioID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mascota" ADD CONSTRAINT "mascota_RazaID_fkey" FOREIGN KEY ("RazaID") REFERENCES "raza"("RazaID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peluqueria" ADD CONSTRAINT "peluqueria_ServicioID_fkey" FOREIGN KEY ("ServicioID") REFERENCES "servicio"("ServicioID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservacion" ADD CONSTRAINT "reservacion_UsuarioID_fkey" FOREIGN KEY ("UsuarioID") REFERENCES "usuario"("UsuarioID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_ReservacionID_fkey" FOREIGN KEY ("ReservacionID") REFERENCES "reservacion"("ReservacionID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_MascotaID_fkey" FOREIGN KEY ("MascotaID") REFERENCES "mascota"("MascotaID") ON DELETE RESTRICT ON UPDATE CASCADE;
