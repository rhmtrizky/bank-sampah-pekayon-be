import {
  createPengepulSchema,
  createBulkSaleSchema,
} from "../validations/bulkSales.validation.js";
import { BulkSalesService } from "../services/bulkSales.service.js";
import { asyncHandler } from "../utils/errors.js";
import { created, ok } from "../utils/response.js";

export const createPengepul = asyncHandler(async (req, res) => {
  const parsed = createPengepulSchema.parse(req.body);
  const data = await BulkSalesService.createPengepul(req.user, parsed);
  return created(res, data, "Pengepul created");
});

export const listPengepul = asyncHandler(async (_req, res) => {
  const data = await BulkSalesService.listPengepul();
  return ok(res, data, "Pengepul list");
});

export const createBulkSale = asyncHandler(async (req, res) => {
  const parsed = createBulkSaleSchema.parse(req.body);
  const data = await BulkSalesService.createBulkSale(req.user, parsed);
  return created(res, data, "Bulk sale created");
});

export const listBulkSales = asyncHandler(async (req, res) => {
  const data = await BulkSalesService.listBulkSales(req.query);
  return ok(res, data, "Bulk sales list");
});
