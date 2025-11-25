-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('warga', 'rw', 'kelurahan', 'ppsu');

-- CreateEnum
CREATE TYPE "TransactionMethod" AS ENUM ('offline', 'online');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'scheduled', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "WalletHistoryType" AS ENUM ('deposit', 'withdraw');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'warga',
    "rt" INTEGER,
    "rw" INTEGER,
    "kelurahan_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "kelurahan" (
    "kelurahan_id" SERIAL NOT NULL,
    "nama_kelurahan" TEXT NOT NULL,
    "kecamatan" TEXT,
    "kota" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kelurahan_pkey" PRIMARY KEY ("kelurahan_id")
);

-- CreateTable
CREATE TABLE "rw_list" (
    "rw_id" SERIAL NOT NULL,
    "kelurahan_id" INTEGER NOT NULL,
    "nomor_rw" INTEGER NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rw_list_pkey" PRIMARY KEY ("rw_id")
);

-- CreateTable
CREATE TABLE "waste_types" (
    "waste_type_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "waste_types_pkey" PRIMARY KEY ("waste_type_id")
);

-- CreateTable
CREATE TABLE "price_list" (
    "price_id" SERIAL NOT NULL,
    "waste_type_id" INTEGER NOT NULL,
    "rw_id" INTEGER,
    "kelurahan_id" INTEGER,
    "buy_price" DECIMAL(12,2) NOT NULL,
    "sell_price" DECIMAL(12,2) NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "price_list_pkey" PRIMARY KEY ("price_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "transaction_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rw_id" INTEGER NOT NULL,
    "kelurahan_id" INTEGER,
    "waste_type_id" INTEGER NOT NULL,
    "weight_kg" DECIMAL(12,3) NOT NULL,
    "price_per_kg" DECIMAL(12,2) NOT NULL,
    "total_amount" DECIMAL(14,2) NOT NULL,
    "transaction_method" "TransactionMethod" NOT NULL,
    "request_id" INTEGER,
    "rt" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "deposit_requests" (
    "request_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rw_id" INTEGER NOT NULL,
    "waste_type_id" INTEGER NOT NULL,
    "estimated_weight" DECIMAL(12,3) NOT NULL,
    "photo" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "scheduled_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deposit_requests_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "wallet_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "balance" DECIMAL(14,2) NOT NULL DEFAULT 0,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("wallet_id")
);

-- CreateTable
CREATE TABLE "wallet_history" (
    "history_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "WalletHistoryType" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "reference_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_history_pkey" PRIMARY KEY ("history_id")
);

-- CreateTable
CREATE TABLE "collection_schedules" (
    "schedule_id" SERIAL NOT NULL,
    "rw_id" INTEGER,
    "kelurahan_id" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "collection_schedules_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "withdraw_schedules" (
    "withdraw_schedule_id" SERIAL NOT NULL,
    "rw_id" INTEGER,
    "kelurahan_id" INTEGER,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdraw_schedules_pkey" PRIMARY KEY ("withdraw_schedule_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "rw_id" INTEGER,
    "kelurahan_id" INTEGER,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "pengepul" (
    "pengepul_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,

    CONSTRAINT "pengepul_pkey" PRIMARY KEY ("pengepul_id")
);

-- CreateTable
CREATE TABLE "bulk_sales" (
    "sale_id" SERIAL NOT NULL,
    "rw_id" INTEGER,
    "kelurahan_id" INTEGER,
    "pengepul_id" INTEGER NOT NULL,
    "total_weight" DECIMAL(14,3) NOT NULL,
    "total_amount" DECIMAL(14,2) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bulk_sales_pkey" PRIMARY KEY ("sale_id")
);

-- CreateTable
CREATE TABLE "bulk_sale_items" (
    "sale_item_id" SERIAL NOT NULL,
    "sale_id" INTEGER NOT NULL,
    "waste_type_id" INTEGER NOT NULL,
    "weight_kg" DECIMAL(14,3) NOT NULL,
    "price_per_kg" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "bulk_sale_items_pkey" PRIMARY KEY ("sale_item_id")
);

-- CreateTable
CREATE TABLE "reports" (
    "report_id" SERIAL NOT NULL,
    "rw_id" INTEGER,
    "kelurahan_id" INTEGER,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "total_transactions" INTEGER NOT NULL,
    "total_weight" DECIMAL(14,3) NOT NULL,
    "total_revenue" DECIMAL(14,2) NOT NULL,
    "total_withdraw" DECIMAL(14,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "_rw_listTowaste_types" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_rw_listTowaste_types_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "price_list_waste_type_id_idx" ON "price_list"("waste_type_id");

-- CreateIndex
CREATE INDEX "price_list_rw_id_idx" ON "price_list"("rw_id");

-- CreateIndex
CREATE INDEX "price_list_kelurahan_id_idx" ON "price_list"("kelurahan_id");

-- CreateIndex
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX "transactions_rw_id_idx" ON "transactions"("rw_id");

-- CreateIndex
CREATE INDEX "transactions_waste_type_id_idx" ON "transactions"("waste_type_id");

-- CreateIndex
CREATE INDEX "deposit_requests_user_id_idx" ON "deposit_requests"("user_id");

-- CreateIndex
CREATE INDEX "deposit_requests_rw_id_idx" ON "deposit_requests"("rw_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_user_id_key" ON "wallets"("user_id");

-- CreateIndex
CREATE INDEX "wallet_history_user_id_idx" ON "wallet_history"("user_id");

-- CreateIndex
CREATE INDEX "collection_schedules_rw_id_idx" ON "collection_schedules"("rw_id");

-- CreateIndex
CREATE INDEX "collection_schedules_kelurahan_id_idx" ON "collection_schedules"("kelurahan_id");

-- CreateIndex
CREATE INDEX "withdraw_schedules_rw_id_idx" ON "withdraw_schedules"("rw_id");

-- CreateIndex
CREATE INDEX "withdraw_schedules_kelurahan_id_idx" ON "withdraw_schedules"("kelurahan_id");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_rw_id_idx" ON "notifications"("rw_id");

-- CreateIndex
CREATE INDEX "notifications_kelurahan_id_idx" ON "notifications"("kelurahan_id");

-- CreateIndex
CREATE INDEX "bulk_sales_rw_id_idx" ON "bulk_sales"("rw_id");

-- CreateIndex
CREATE INDEX "bulk_sales_kelurahan_id_idx" ON "bulk_sales"("kelurahan_id");

-- CreateIndex
CREATE INDEX "bulk_sales_pengepul_id_idx" ON "bulk_sales"("pengepul_id");

-- CreateIndex
CREATE INDEX "bulk_sale_items_sale_id_idx" ON "bulk_sale_items"("sale_id");

-- CreateIndex
CREATE INDEX "bulk_sale_items_waste_type_id_idx" ON "bulk_sale_items"("waste_type_id");

-- CreateIndex
CREATE INDEX "reports_rw_id_idx" ON "reports"("rw_id");

-- CreateIndex
CREATE INDEX "reports_kelurahan_id_idx" ON "reports"("kelurahan_id");

-- CreateIndex
CREATE INDEX "_rw_listTowaste_types_B_index" ON "_rw_listTowaste_types"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_rw_fkey" FOREIGN KEY ("rw") REFERENCES "rw_list"("rw_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rw_list" ADD CONSTRAINT "rw_list_kelurahan_id_fkey" FOREIGN KEY ("kelurahan_id") REFERENCES "kelurahan"("kelurahan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_list" ADD CONSTRAINT "price_list_waste_type_id_fkey" FOREIGN KEY ("waste_type_id") REFERENCES "waste_types"("waste_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_list" ADD CONSTRAINT "price_list_rw_id_fkey" FOREIGN KEY ("rw_id") REFERENCES "rw_list"("rw_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_list" ADD CONSTRAINT "price_list_kelurahan_id_fkey" FOREIGN KEY ("kelurahan_id") REFERENCES "kelurahan"("kelurahan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_rw_id_fkey" FOREIGN KEY ("rw_id") REFERENCES "rw_list"("rw_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_waste_type_id_fkey" FOREIGN KEY ("waste_type_id") REFERENCES "waste_types"("waste_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "deposit_requests"("request_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_requests" ADD CONSTRAINT "deposit_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_requests" ADD CONSTRAINT "deposit_requests_rw_id_fkey" FOREIGN KEY ("rw_id") REFERENCES "rw_list"("rw_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deposit_requests" ADD CONSTRAINT "deposit_requests_waste_type_id_fkey" FOREIGN KEY ("waste_type_id") REFERENCES "waste_types"("waste_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_history" ADD CONSTRAINT "wallet_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_schedules" ADD CONSTRAINT "collection_schedules_rw_id_fkey" FOREIGN KEY ("rw_id") REFERENCES "rw_list"("rw_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_schedules" ADD CONSTRAINT "collection_schedules_kelurahan_id_fkey" FOREIGN KEY ("kelurahan_id") REFERENCES "kelurahan"("kelurahan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraw_schedules" ADD CONSTRAINT "withdraw_schedules_rw_id_fkey" FOREIGN KEY ("rw_id") REFERENCES "rw_list"("rw_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraw_schedules" ADD CONSTRAINT "withdraw_schedules_kelurahan_id_fkey" FOREIGN KEY ("kelurahan_id") REFERENCES "kelurahan"("kelurahan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_rw_id_fkey" FOREIGN KEY ("rw_id") REFERENCES "rw_list"("rw_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_kelurahan_id_fkey" FOREIGN KEY ("kelurahan_id") REFERENCES "kelurahan"("kelurahan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_sales" ADD CONSTRAINT "bulk_sales_rw_id_fkey" FOREIGN KEY ("rw_id") REFERENCES "rw_list"("rw_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_sales" ADD CONSTRAINT "bulk_sales_kelurahan_id_fkey" FOREIGN KEY ("kelurahan_id") REFERENCES "kelurahan"("kelurahan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_sales" ADD CONSTRAINT "bulk_sales_pengepul_id_fkey" FOREIGN KEY ("pengepul_id") REFERENCES "pengepul"("pengepul_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_sale_items" ADD CONSTRAINT "bulk_sale_items_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "bulk_sales"("sale_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bulk_sale_items" ADD CONSTRAINT "bulk_sale_items_waste_type_id_fkey" FOREIGN KEY ("waste_type_id") REFERENCES "waste_types"("waste_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_rw_id_fkey" FOREIGN KEY ("rw_id") REFERENCES "rw_list"("rw_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_kelurahan_id_fkey" FOREIGN KEY ("kelurahan_id") REFERENCES "kelurahan"("kelurahan_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_rw_listTowaste_types" ADD CONSTRAINT "_rw_listTowaste_types_A_fkey" FOREIGN KEY ("A") REFERENCES "rw_list"("rw_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_rw_listTowaste_types" ADD CONSTRAINT "_rw_listTowaste_types_B_fkey" FOREIGN KEY ("B") REFERENCES "waste_types"("waste_type_id") ON DELETE CASCADE ON UPDATE CASCADE;
