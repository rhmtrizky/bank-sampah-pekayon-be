import {
  createWasteTypeSchema,
  updateWasteTypeSchema,
} from "../validations/wasteTypes.validation.js";
import { WasteTypesService } from "../services/wasteTypes.service.js";
import { asyncHandler } from "../utils/errors.js";
import { created, ok } from "../utils/response.js";

export const createWasteType = asyncHandler(async (req, res) => {
  const parsed = createWasteTypeSchema.parse(req.body);
  const data = await WasteTypesService.create(req.user, parsed);
  return created(res, data, "Waste type created");
});

export const listWasteTypes = asyncHandler(async (_req, res) => {
  const data = await WasteTypesService.list();
  return ok(res, data, "Waste types");
});

export const updateWasteType = asyncHandler(async (req, res) => {
  const parsed = updateWasteTypeSchema.parse(req.body);
  const data = await WasteTypesService.update(
    req.user,
    Number(req.params.id),
    parsed
  );
  return ok(res, data, "Waste type updated");
});

export const deleteWasteType = asyncHandler(async (req, res) => {
  const data = await WasteTypesService.remove(req.user, Number(req.params.id));
  return ok(res, data, "Waste type deleted");
});
