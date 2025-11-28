import { AppError } from "../utils/errors.js";
import { DepositRequestsRepo } from "../repositories/depositRequests.repo.js";
import { PriceListRepo } from "../repositories/priceList.repo.js";
import { TransactionsRepo } from "../repositories/transactions.repo.js";
import { WalletsRepo } from "../repositories/wallets.repo.js";
import { WalletHistoryRepo } from "../repositories/walletHistory.repo.js";
import { UsersRepo } from "../repositories/users.repo.js";

function toDec(num, digits = 2) {
  return Number(num).toFixed(digits);
}

export const DepositRequestsService = {
  async create(user, { rw_id, items, photo, photo_url }) {
    if (user.role !== "warga")
      throw new AppError(403, "Only warga can create deposit requests");
    if (!user.rw) throw new AppError(400, "User has no RW assigned");

    const photoUrl =
      [photo, photo_url]
        .find((v) => typeof v === "string" && v.trim() !== "")
        ?.trim() ?? null;
    const dr = await DepositRequestsRepo.create({
      user_id: user.user_id,
      rw_id: user.rw,
      photoUrl,
      items: items.map((i) => ({
        waste_type_id: i.waste_type_id,
        weight_kg: toDec(i.weight_kg, 3),
      })),
    });
    return dr;
  },

  async listMine(user) {
    if (user.role !== "warga")
      throw new AppError(403, "Only warga can list their deposit requests");
    return DepositRequestsRepo.listMine(user.user_id);
  },

  async detail(user, request_id) {
    const id = Number(request_id);
    if (Number.isNaN(id)) throw new AppError(400, "Invalid request id");
    const dr = await DepositRequestsRepo.findDetailById(id);
    if (!dr) throw new AppError(404, "Deposit request not found");
    // Authorization: warga only own requests; rw only for own rw; kelurahan/super_admin allowed
    if (user.role === "warga" && dr.user_id !== user.user_id)
      throw new AppError(403, "Forbidden");
    if (user.role === "rw" && dr.rw_id !== user.rw)
      throw new AppError(403, "Forbidden");
    return dr;
  },

  async schedule(rwUser, request_id, { scheduled_date }) {
    if (rwUser.role !== "rw")
      throw new AppError(403, "Only RW can schedule deposit requests");
    const dr = await DepositRequestsRepo.findById(request_id);
    if (!dr) throw new AppError(404, "Deposit request not found");
    if (dr.rw_id !== rwUser.rw)
      throw new AppError(403, "Deposit request belongs to different RW");
    if (dr.status !== "pending")
      throw new AppError(400, "Only pending requests can be scheduled");
    const updated = await DepositRequestsRepo.update(request_id, {
      status: "scheduled",
      scheduled_date: new Date(scheduled_date),
    });
    return updated;
  },

  async complete(rwUser, request_id, { actual_weight_kg }) {
    if (rwUser.role !== "rw")
      throw new AppError(403, "Only RW can complete deposit requests");
    const dr = await DepositRequestsRepo.findById(request_id);
    if (!dr) throw new AppError(404, "Deposit request not found");
    if (dr.rw_id !== rwUser.rw)
      throw new AppError(403, "Deposit request belongs to different RW");
    if (dr.status !== "scheduled")
      throw new AppError(400, "Only scheduled requests can be completed");

    const warga = await UsersRepo.findById(dr.user_id);
    if (!warga) throw new AppError(404, "Warga not found");
    // For multiple items, this method should be revisited to compute per-item.
    // Keeping previous logic for compatibility until completion flow is redesigned.
    const firstItem = await prisma.deposit_request_items.findFirst({
      where: { request_id: dr.request_id },
      orderBy: { item_id: "asc" },
    });
    if (!firstItem) throw new AppError(400, "No items found for this request");

    const price = await PriceListRepo.findLatestByRwAndWaste(
      rwUser.rw,
      firstItem.waste_type_id
    );
    if (!price) throw new AppError(400, "Price list entry not found");

    const pricePerKg = Number(price.buy_price);
    const totalAmount = pricePerKg * Number(actual_weight_kg);

    const transaction = await TransactionsRepo.create({
      user_id: warga.user_id,
      rw_id: rwUser.rw,
      waste_type_id: firstItem.waste_type_id,
      weight_kg: toDec(actual_weight_kg, 3),
      price_per_kg: toDec(pricePerKg, 2),
      total_amount: toDec(totalAmount, 2),
      transaction_method: "online",
      request_id: dr.request_id,
      rt: warga.rt || null,
    });

    await WalletsRepo.updateBalance(warga.user_id, totalAmount);
    await WalletHistoryRepo.create({
      user_id: warga.user_id,
      type: "deposit",
      amount: toDec(totalAmount, 2),
      reference_id: transaction.transaction_id,
    });

    await DepositRequestsRepo.update(request_id, { status: "completed" });
    return { request: dr, transaction };
  },

  // warga cancels their own pending request
  async cancel(user, request_id) {
    if (user.role !== "warga")
      throw new AppError(403, "Only warga can cancel deposit requests");

    const id = Number(request_id);
    if (Number.isNaN(id)) throw new AppError(400, "Invalid request id");

    const dr = await DepositRequestsRepo.findById(id);
    if (!dr) throw new AppError(404, "Deposit request not found");
    if (dr.user_id !== user.user_id) throw new AppError(403, "Forbidden");
    if (dr.status !== "pending")
      throw new AppError(400, "Only pending requests can be canceled");

    const updated = await DepositRequestsRepo.update(id, {
      status: "cancelled",
    });
    return updated;
  },
};
