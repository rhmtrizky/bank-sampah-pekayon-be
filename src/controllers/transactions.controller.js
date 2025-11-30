import { offlineTransactionSchema } from "../validations/transactions.validation.js";
import { TransactionsService } from "../services/transactions.service.js";
import { asyncHandler } from "../utils/errors.js";
import { created, ok } from "../utils/response.js";
import { z } from "zod";

export const createOffline = asyncHandler(async (req, res) => {
  const parsed = offlineTransactionSchema.parse(req.body);
  const result = await TransactionsService.createOffline(parsed, req.user);
  return created(res, result, "Offline transactions created");
});

const listSchema = z.object({
  month: z.coerce.number().int().min(1).max(12).optional(),
  year: z.coerce.number().int().min(2000).max(2100).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  name: z.string().min(1).optional(),
  method: z.enum(["online", "offline"]).optional(),
  waste_type_id: z.coerce.number().int().positive().optional(),
});

export const listTransactions = asyncHandler(async (req, res) => {
  const params = listSchema.parse(req.query);
  const data = await TransactionsService.list(req.user, params);
  return ok(res, data, "Transactions list");
});

export const getTransactionById = asyncHandler(async (req, res) => {
  const tx = await TransactionsService.getById(req.user, req.params.id);
  return ok(res, tx, "Transaction detail");
});

const updateSchema = z.object({
  weight_kg: z.coerce.number().positive(),
});

export const updateTransaction = asyncHandler(async (req, res) => {
  const parsed = updateSchema.parse(req.body);
  const tx = await TransactionsService.update(req.user, req.params.id, parsed);
  return ok(res, tx, "Transaction updated");
});

export const deleteTransaction = asyncHandler(async (req, res) => {
  const result = await TransactionsService.delete(req.user, req.params.id);
  return ok(res, result, "Transaction deleted");
});
