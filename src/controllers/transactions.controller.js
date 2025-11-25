import { offlineTransactionSchema } from "../validations/transactions.validation.js";
import { TransactionsService } from "../services/transactions.service.js";
import { asyncHandler } from "../utils/errors.js";
import { created } from "../utils/response.js";

export const createOffline = asyncHandler(async (req, res) => {
  const parsed = offlineTransactionSchema.parse(req.body);
  const tx = await TransactionsService.createOffline(parsed, req.user);
  return created(res, tx, "Offline transaction created");
});
