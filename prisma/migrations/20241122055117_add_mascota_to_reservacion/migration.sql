/*
  Warnings:

  - Added the required column `MascotaID` to the `reservacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservacion" ADD COLUMN     "MascotaID" SMALLINT NOT NULL;

-- CreateIndex
CREATE INDEX "Reservacion_MascotaID" ON "reservacion"("MascotaID");

-- AddForeignKey
ALTER TABLE "reservacion" ADD CONSTRAINT "reservacion_MascotaID_fkey" FOREIGN KEY ("MascotaID") REFERENCES "mascota"("MascotaID") ON DELETE RESTRICT ON UPDATE CASCADE;
