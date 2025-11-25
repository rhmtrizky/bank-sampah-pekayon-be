import {
  createKelurahanSchema,
  updateKelurahanSchema,
  createRwSchema,
  updateRwSchema,
} from "../validations/admin.validation.js";
import { AdminKelurahanService } from "../services/adminKelurahan.service.js";
import { AdminRwService } from "../services/adminRw.service.js";
import { asyncHandler } from "../utils/errors.js";
import { created, ok } from "../utils/response.js";

// Kelurahan
export const createKelurahan = asyncHandler(async (req, res) => {
  const parsed = createKelurahanSchema.parse(req.body);
  const data = await AdminKelurahanService.create(req.user, parsed);
  return created(res, data, "Kelurahan created");
});

export const listKelurahan = asyncHandler(async (req, res) => {
  const data = await AdminKelurahanService.list(req.user);
  return ok(res, data, "Kelurahan list");
});

export const updateKelurahan = asyncHandler(async (req, res) => {
  const parsed = updateKelurahanSchema.parse(req.body);
  const data = await AdminKelurahanService.update(
    req.user,
    Number(req.params.id),
    parsed
  );
  return ok(res, data, "Kelurahan updated");
});

// RW
export const createRw = asyncHandler(async (req, res) => {
  const parsed = createRwSchema.parse(req.body);
  const data = await AdminRwService.create(req.user, parsed);
  return created(res, data, "RW created");
});

export const listRw = asyncHandler(async (req, res) => {
  const { kelurahan_id } = req.query;
  const data = await AdminRwService.list(req.user, kelurahan_id);
  return ok(res, data, "RW list");
});

export const updateRw = asyncHandler(async (req, res) => {
  const parsed = updateRwSchema.parse(req.body);
  const data = await AdminRwService.update(
    req.user,
    Number(req.params.id),
    parsed
  );
  return ok(res, data, "RW updated");
});
