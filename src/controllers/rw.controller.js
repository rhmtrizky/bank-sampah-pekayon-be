import { RwRepo } from "../repositories/rw.repo.js";
import { asyncHandler } from "../utils/errors.js";
import { ok } from "../utils/response.js";
import { RwService } from "../services/rw.service.js";
import { createWargaSchema } from "../validations/rw.validation.js";
import { z } from "zod";

export const listRwPublic = asyncHandler(async (req, res) => {
  const { kelurahan_id } = req.query;
  const data = await RwRepo.list(
    kelurahan_id ? Number(kelurahan_id) : undefined
  );
  return ok(res, data, "RW list");
});

export const getRwById = asyncHandler(async (req, res) => {
  const rw_id = Number(req.params.id);
  const data = await RwRepo.findById(rw_id);
  return ok(res, data, "RW detail");
});

export const createWargaByRw = asyncHandler(async (req, res) => {
  const payload = createWargaSchema.parse(req.body);
  const user = await RwService.createWarga(req.user, payload);
  return ok(res, user, "Warga created by RW");
});

const listWargaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  name: z.string().min(1).optional(),
  phone: z.string().min(3).optional(),
});

export const listWargaByRw = asyncHandler(async (req, res) => {
  const params = listWargaQuerySchema.parse(req.query);
  const result = await RwService.listWarga(req.user, params);
  return ok(res, result, "Warga list by RW");
});
