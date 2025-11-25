import { WalletsRepo } from "../repositories/wallets.repo.js";
import { WalletHistoryRepo } from "../repositories/walletHistory.repo.js";
import { AppError } from "../utils/errors.js";

export const WalletService = {
  async getWallet(user_id) {
    const wallet = await WalletsRepo.findByUserId(user_id);
    if (!wallet) throw new AppError(404, "Wallet not found");
    return wallet;
  },

  async getHistory(user_id, { page = 1, pageSize = 50 } = {}) {
    const skip = (page - 1) * pageSize;
    const items = await WalletHistoryRepo.listByUser(user_id, {
      skip,
      take: pageSize,
    });
    return { page, pageSize, items };
  },
};
