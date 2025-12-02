/*
  Warnings:

  - Added the required column `title` to the `collection_schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `withdraw_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- Alter collection_schedules: add required title with a safe default for existing rows
ALTER TABLE "collection_schedules" ADD COLUMN "title" TEXT NOT NULL DEFAULT 'Jadwal Pengumpulan';

-- Alter withdraw_schedules: add required title with a safe default and optional description
ALTER TABLE "withdraw_schedules" ADD COLUMN "description" TEXT,
ADD COLUMN "title" TEXT NOT NULL DEFAULT 'Jadwal Penarikan';
