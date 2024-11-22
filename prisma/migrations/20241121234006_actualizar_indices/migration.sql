/*
  Warnings:

  - Added the required column `Descripcion` to the `servicio_medico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "servicio_medico" ADD COLUMN     "Descripcion" VARCHAR(100) NOT NULL;
