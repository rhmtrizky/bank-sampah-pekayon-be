import { RwRepo } from "../repositories/rw.repo.js";
import { asyncHandler } from "../utils/errors.js";
import { ok } from "../utils/response.js";

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
