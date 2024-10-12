/*
  Warnings:

  - Added the required column `IPDir` to the `bitacora` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bitacora" ADD COLUMN     "IPDir" INET NOT NULL;
