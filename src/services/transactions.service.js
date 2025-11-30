import { AppError } from "../utils/errors.js";
import { UsersRepo } from "../repositories/users.repo.js";
import { PriceListRepo } from "../repositories/priceList.repo.js";
import { TransactionsRepo } from "../repositories/transactions.repo.js";
import { WalletsRepo } from "../repositories/wallets.repo.js";
import { WalletHistoryRepo } from "../repositories/walletHistory.repo.js";

function toDecimalString(num, fractionDigits = 2) {
  return Number(num).toFixed(fractionDigits);
}

export const TransactionsService = {
  async createOffline({ user_id, items }, rwUser) {
    if (rwUser.role !== "rw")
      throw new AppError(403, "Only RW can create offline transactions");
    const warga = await UsersRepo.findById(user_id);
    if (!warga || warga.role !== "warga")
      throw new AppError(404, "Target warga not found");
    if (warga.rw !== rwUser.rw)
      throw new AppError(403, "Warga belongs to different RW");

    const created = [];
    let totalDelta = 0;
    for (const item of items) {
      const price = await PriceListRepo.findLatestByRwAndWaste(
        rwUser.rw,
        item.waste_type_id
      );
      if (!price)
        throw new AppError(
          400,
          "Price list entry not found for RW & waste type"
        );

      const pricePerKg = Number(price.buy_price);
      const totalAmount = pricePerKg * Number(item.weight_kg);

      const tx = await TransactionsRepo.create({
        user_id: warga.user_id,
        rw_id: rwUser.rw,
        waste_type_id: item.waste_type_id,
        weight_kg: toDecimalString(item.weight_kg, 3),
        price_per_kg: toDecimalString(pricePerKg, 2),
        total_amount: toDecimalString(totalAmount, 2),
        transaction_method: "offline",
        rt: warga.rt || null,
      });
      created.push(tx);
      totalDelta += totalAmount;
      await WalletHistoryRepo.create({
        user_id: warga.user_id,
        type: "deposit",
        amount: toDecimalString(totalAmount, 2),
        reference_id: tx.transaction_id,
      });
    }

    // Update wallet once for total delta
    if (totalDelta > 0) {
      await WalletsRepo.updateBalance(warga.user_id, totalDelta);
    }
    return {
      transactions: created,
      wallet_delta: toDecimalString(totalDelta, 2),
    };
  },

  async list(
    rwUser,
    {
      month,
      year,
      page = 1,
      limit = 20,
      from_date,
      to_date,
      name,
      method,
      waste_type_id,
    } = {}
  ) {
    if (rwUser.role !== "rw")
      throw new AppError(403, "Only RW can list transactions");
    return TransactionsRepo.listPaginatedByRw(rwUser.rw, {
      month,
      year,
      page,
      limit,
      from_date,
      to_date,
      name,
      method,
      waste_type_id,
    });
  },

  async getById(rwUser, id) {
    if (rwUser.role !== "rw")
      throw new AppError(403, "Only RW can view transactions");
    const tx = await TransactionsRepo.findById(Number(id));
    if (!tx) throw new AppError(404, "Transaction not found");
    if (tx.rw_id !== rwUser.rw)
      throw new AppError(403, "Transaction belongs to different RW");
    return tx;
  },

  async update(rwUser, id, { weight_kg }) {
    if (rwUser.role !== "rw")
      throw new AppError(403, "Only RW can update transactions");
    const tx = await TransactionsRepo.findById(Number(id));
    if (!tx) throw new AppError(404, "Transaction not found");
    if (tx.rw_id !== rwUser.rw)
      throw new AppError(403, "Transaction belongs to different RW");

    // Recompute total_amount using latest price list
    const price = await PriceListRepo.findLatestByRwAndWaste(
      rwUser.rw,
      tx.waste_type_id
    );
    if (!price)
      throw new AppError(400, "Price list entry not found for RW & waste type");
    const pricePerKg = Number(price.buy_price);
    const totalAmount = pricePerKg * Number(weight_kg);

    const updated = await TransactionsRepo.update(Number(id), {
      weight_kg: toDecimalString(weight_kg, 3),
      price_per_kg: toDecimalString(pricePerKg, 2),
      total_amount: toDecimalString(totalAmount, 2),
    });
    return updated;
  },

  async delete(rwUser, id) {
    if (rwUser.role !== "rw")
      throw new AppError(403, "Only RW can delete transactions");
    const tx = await TransactionsRepo.findById(Number(id));
    if (!tx) throw new AppError(404, "Transaction not found");
    if (tx.rw_id !== rwUser.rw)
      throw new AppError(403, "Transaction belongs to different RW");
    await TransactionsRepo.delete(Number(id));
    return { success: true };
  },
};
