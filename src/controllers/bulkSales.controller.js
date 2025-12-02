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

export const listPengepul = asyncHandler(async (req, res) => {
  const data = await BulkSalesService.listPengepul(req.query);
  return ok(res, data, "Pengepul list");
});

export const updatePengepul = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Invalid pengepul id");
  }
  const parsed = createPengepulSchema.parse(req.body);
  const data = await BulkSalesService.updatePengepul(req.user, id, parsed);
  return ok(res, data, "Pengepul updated");
});

export const deletePengepul = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error("Invalid pengepul id");
  }
  const result = await BulkSalesService.deletePengepul(req.user, id);
  return ok(res, result, "Pengepul deleted");
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
