/*
  Warnings:

  - The values [RegistroPersonal,RegistroCliente,RegistroMascota,ListarPersonal,ListarCliente,ListarMascota,Reservacion] on the enum `tipoaccionbitacora_Accion` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `FechaHora` on table `bitacora` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "tipoaccionbitacora_Accion_new" AS ENUM ('Login', 'Logout', 'CrearPersonal', 'CrearCliente', 'CrearMascota', 'LeerPersonal', 'LeerCliente', 'LeerMascota', 'UpdatePersonal', 'UpdateCliente', 'UpdateMascota', 'CrearReservacion', 'LeerReservacion');
ALTER TABLE "tipoaccionbitacora" ALTER COLUMN "Accion" TYPE "tipoaccionbitacora_Accion_new" USING ("Accion"::text::"tipoaccionbitacora_Accion_new");
ALTER TYPE "tipoaccionbitacora_Accion" RENAME TO "tipoaccionbitacora_Accion_old";
ALTER TYPE "tipoaccionbitacora_Accion_new" RENAME TO "tipoaccionbitacora_Accion";
DROP TYPE "tipoaccionbitacora_Accion_old";
COMMIT;

-- AlterTable
ALTER TABLE "bitacora" ALTER COLUMN "FechaHora" SET NOT NULL,
ALTER COLUMN "FechaHora" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "bitacora" ADD CONSTRAINT "bitacora_UsuarioID_fkey" FOREIGN KEY ("UsuarioID") REFERENCES "usuario"("UsuarioID") ON DELETE RESTRICT ON UPDATE CASCADE;
