/*
  Warnings:

  - You are about to drop the column `estimated_weight` on the `deposit_requests` table. All the data in the column will be lost.
  - You are about to drop the column `waste_type_id` on the `deposit_requests` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "deposit_requests" DROP CONSTRAINT "deposit_requests_waste_type_id_fkey";

-- AlterTable
ALTER TABLE "deposit_requests" DROP COLUMN "estimated_weight",
DROP COLUMN "waste_type_id";

-- CreateTable
CREATE TABLE "deposit_request_items" (
    "item_id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "waste_type_id" INTEGER NOT NULL,
    "weight_kg" DECIMAL(12,3) NOT NULL,

    CONSTRAINT "deposit_request_items_pkey" PRIMARY KEY ("item_id")
);

-- CreateIndex
CREATE INDEX "deposit_request_items_request_id_idx" ON "deposit_request_items"("request_id");

-- CreateIndex
CREATE INDEX "deposit_request_items_waste_type_id_idx" ON "deposit_request_items"("waste_type_id");

-- AddForeignKey
ALTER TABLE "deposit_request_items" ADD CONSTRAINT "deposit_request_items_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "deposit_requests"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_request_items" ADD CONSTRAINT "deposit_request_items_waste_type_id_fkey" FOREIGN KEY ("waste_type_id") REFERENCES "waste_types"("waste_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;
