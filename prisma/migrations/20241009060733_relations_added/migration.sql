/*
  Warnings:

  - A unique constraint covering the columns `[TipoAccionBitacoraID]` on the table `bitacora` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[PersonalID]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ClienteID]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "bitacora_TipoAccionBitacoraID_key" ON "bitacora"("TipoAccionBitacoraID");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_PersonalID_key" ON "usuario"("PersonalID");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_ClienteID_key" ON "usuario"("ClienteID");

-- AddForeignKey
ALTER TABLE "bitacora" ADD CONSTRAINT "bitacora_TipoAccionBitacoraID_fkey" FOREIGN KEY ("TipoAccionBitacoraID") REFERENCES "tipoaccionbitacora"("TipoAccionBitacoraID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mascota" ADD CONSTRAINT "mascota_ClienteID_fkey" FOREIGN KEY ("ClienteID") REFERENCES "cliente"("ClienteID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raza" ADD CONSTRAINT "raza_EspecieID_fkey" FOREIGN KEY ("EspecieID") REFERENCES "especie"("EspecieID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrodevacunas" ADD CONSTRAINT "registrodevacunas_VacunaID_fkey" FOREIGN KEY ("VacunaID") REFERENCES "vacuna"("VacunaID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrodevacunas" ADD CONSTRAINT "registrodevacunas_MascotaID_fkey" FOREIGN KEY ("MascotaID") REFERENCES "mascota"("MascotaID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_PersonalID_fkey" FOREIGN KEY ("PersonalID") REFERENCES "personal"("PersonalID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_PersonalID_fkey" FOREIGN KEY ("PersonalID") REFERENCES "personal"("PersonalID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_ClienteID_fkey" FOREIGN KEY ("ClienteID") REFERENCES "cliente"("ClienteID") ON DELETE SET NULL ON UPDATE CASCADE;
