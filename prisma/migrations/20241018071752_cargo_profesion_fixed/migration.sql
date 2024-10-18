/*
  Warnings:

  - The values [ReadPersonal,UpdatePersonal,ReadCliente,UpdateCliente,ReadMascota,UpdateMascota,ReadReservacion,UpdateReservacion] on the enum `tipoaccionbitacora_Accion` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "tipoaccionbitacora_Accion_new" AS ENUM ('Login', 'Logout', 'CrearPersonal', 'ListarPersonal', 'ActualizarPersonal', 'CrearCliente', 'ListarClientes', 'ActualizarCliente', 'CrearMascota', 'ListarMascotas', 'ActualizarMascota', 'CrearReservacion', 'ListarReservacion', 'ActualizarReservacion');
ALTER TABLE "tipoaccionbitacora" ALTER COLUMN "Accion" TYPE "tipoaccionbitacora_Accion_new" USING ("Accion"::text::"tipoaccionbitacora_Accion_new");
ALTER TYPE "tipoaccionbitacora_Accion" RENAME TO "tipoaccionbitacora_Accion_old";
ALTER TYPE "tipoaccionbitacora_Accion_new" RENAME TO "tipoaccionbitacora_Accion";
DROP TYPE "tipoaccionbitacora_Accion_old";
COMMIT;

-- AddForeignKey
ALTER TABLE "personal" ADD CONSTRAINT "personal_CargoID_fkey" FOREIGN KEY ("CargoID") REFERENCES "cargo"("CargoID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal" ADD CONSTRAINT "personal_ProfesionID_fkey" FOREIGN KEY ("ProfesionID") REFERENCES "profesion"("ProfesionID") ON DELETE RESTRICT ON UPDATE CASCADE;
