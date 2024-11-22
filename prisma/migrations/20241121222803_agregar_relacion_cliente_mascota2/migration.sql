/*
  Warnings:

  - Added the required column `ClienteID` to the `reservacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ServicioMedicoID` to the `reservacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservacion" ADD COLUMN     "ClienteID" INTEGER NOT NULL,
ADD COLUMN     "ServicioMedicoID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "servicio_medico" (
    "ServicioMedicoID" SERIAL NOT NULL,
    "Nombre" VARCHAR(100) NOT NULL,
    "Precio" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "servicio_medico_pkey" PRIMARY KEY ("ServicioMedicoID")
);

-- AddForeignKey
ALTER TABLE "reservacion" ADD CONSTRAINT "reservacion_ServicioMedicoID_fkey" FOREIGN KEY ("ServicioMedicoID") REFERENCES "servicio_medico"("ServicioMedicoID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservacion" ADD CONSTRAINT "reservacion_ClienteID_fkey" FOREIGN KEY ("ClienteID") REFERENCES "cliente"("ClienteID") ON DELETE RESTRICT ON UPDATE CASCADE;
