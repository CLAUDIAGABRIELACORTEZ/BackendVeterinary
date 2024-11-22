-- CreateIndex
CREATE INDEX "Reservacion_ServicioMedicoID" ON "reservacion"("ServicioMedicoID");

-- CreateIndex
CREATE INDEX "Reservacion_ClienteID" ON "reservacion"("ClienteID");

-- RenameIndex
ALTER INDEX "UsuarioID" RENAME TO "Reservacion_UsuarioID";

-- RenameIndex
ALTER INDEX "ClienteID" RENAME TO "Usuario_ClienteID";

-- RenameIndex
ALTER INDEX "PersonalID" RENAME TO "Usuario_PersonalID";
