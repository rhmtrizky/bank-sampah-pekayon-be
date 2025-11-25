/*
  Warnings:

  - A unique constraint covering the columns `[kelurahan_id,nomor_rw]` on the table `rw_list` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'super_admin';

-- AlterTable
ALTER TABLE "rw_list" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "rw_list_kelurahan_id_nomor_rw_key" ON "rw_list"("kelurahan_id", "nomor_rw");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
