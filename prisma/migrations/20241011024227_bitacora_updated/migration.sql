/*
  Warnings:

  - The values [Recepcionista,Interno] on the enum `cargo_Cargo` will be removed. If these variants are still used in the database, this will fail.
  - The values [Consulta] on the enum `tipoaccionbitacora_Accion` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "cargo_Cargo_new" AS ENUM ('Administrador', 'Medico', 'Laboratorista', 'Enfermero', 'Peluquero', 'Practicante');
ALTER TABLE "cargo" ALTER COLUMN "Cargo" DROP DEFAULT;
ALTER TABLE "cargo" ALTER COLUMN "Cargo" TYPE "cargo_Cargo_new" USING ("Cargo"::text::"cargo_Cargo_new");
ALTER TYPE "cargo_Cargo" RENAME TO "cargo_Cargo_old";
ALTER TYPE "cargo_Cargo_new" RENAME TO "cargo_Cargo";
DROP TYPE "cargo_Cargo_old";
ALTER TABLE "cargo" ALTER COLUMN "Cargo" SET DEFAULT 'Enfermero';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "tipoaccionbitacora_Accion_new" AS ENUM ('Login', 'Logout', 'RegistroPersonal', 'RegistroCliente', 'RegistroMascota', 'UpdatePersonal', 'UpdateCliente', 'UpdateMascota', 'ListarPersonal', 'ListarCliente', 'ListarMascota', 'Reservacion');
ALTER TABLE "tipoaccionbitacora" ALTER COLUMN "Accion" TYPE "tipoaccionbitacora_Accion_new" USING ("Accion"::text::"tipoaccionbitacora_Accion_new");
ALTER TYPE "tipoaccionbitacora_Accion" RENAME TO "tipoaccionbitacora_Accion_old";
ALTER TYPE "tipoaccionbitacora_Accion_new" RENAME TO "tipoaccionbitacora_Accion";
DROP TYPE "tipoaccionbitacora_Accion_old";
COMMIT;
