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
  async createOffline({ user_id, waste_type_id, weight_kg }, rwUser) {
    if (rwUser.role !== "rw")
      throw new AppError(403, "Only RW can create offline transactions");
    const warga = await UsersRepo.findById(user_id);
    if (!warga || warga.role !== "warga")
      throw new AppError(404, "Target warga not found");
    if (warga.rw !== rwUser.rw)
      throw new AppError(403, "Warga belongs to different RW");

    const price = await PriceListRepo.findLatestByRwAndWaste(
      rwUser.rw,
      waste_type_id
    );
    if (!price)
      throw new AppError(400, "Price list entry not found for RW & waste type");

    const pricePerKg = Number(price.buy_price); // buying price for warga deposit
    const totalAmount = pricePerKg * Number(weight_kg);

    const transaction = await TransactionsRepo.create({
      user_id: warga.user_id,
      rw_id: rwUser.rw,
      waste_type_id,
      weight_kg: toDecimalString(weight_kg, 3),
      price_per_kg: toDecimalString(pricePerKg, 2),
      total_amount: toDecimalString(totalAmount, 2),
      transaction_method: "offline",
      rt: warga.rt || null,
    });

    await WalletsRepo.updateBalance(warga.user_id, totalAmount);
    await WalletHistoryRepo.create({
      user_id: warga.user_id,
      type: "deposit",
      amount: toDecimalString(totalAmount, 2),
      reference_id: transaction.transaction_id,
    });

    return transaction;
  },
};
