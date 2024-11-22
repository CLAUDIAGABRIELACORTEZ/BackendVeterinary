-- CreateTable
CREATE TABLE "historialmedico" (
    "HistorialID" SERIAL NOT NULL,
    "ReservacionID" INTEGER NOT NULL,
    "Notas" VARCHAR(500),
    "FechaCreacion" TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historialmedico_pkey" PRIMARY KEY ("HistorialID")
);

-- CreateIndex
CREATE UNIQUE INDEX "historialmedico_ReservacionID_key" ON "historialmedico"("ReservacionID");

-- CreateIndex
CREATE INDEX "HistorialMedico_ReservacionID" ON "historialmedico"("ReservacionID");

-- AddForeignKey
ALTER TABLE "historialmedico" ADD CONSTRAINT "historialmedico_ReservacionID_fkey" FOREIGN KEY ("ReservacionID") REFERENCES "reservacion"("ReservacionID") ON DELETE RESTRICT ON UPDATE CASCADE;
