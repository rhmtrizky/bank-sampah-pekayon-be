import { WalletService } from "../services/wallet.service.js";
import { asyncHandler } from "../utils/errors.js";
import { ok } from "../utils/response.js";

export const getWallet = asyncHandler(async (req, res) => {
  const data = await WalletService.getWallet(req.user.user_id);
  return ok(res, data, "Wallet");
});

export const getWalletHistory = asyncHandler(async (req, res) => {
  const { page, pageSize } = req.query;
  const data = await WalletService.getHistory(req.user.user_id, {
    page: page ? Number(page) : 1,
    pageSize: pageSize ? Number(pageSize) : 50,
  });
  return ok(res, data, "Wallet history");
});
