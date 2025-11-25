import { createPriceListSchema } from "../validations/wasteTypes.validation.js";
import { PriceListService } from "../services/priceList.service.js";
import { asyncHandler } from "../utils/errors.js";
import { created, ok } from "../utils/response.js";

export const createPriceListRw = asyncHandler(async (req, res) => {
  const parsed = createPriceListSchema.parse(req.body);
  const data = await PriceListService.createForRw(req.user, parsed);
  return created(res, data, "RW price list created");
});

export const createPriceListKelurahan = asyncHandler(async (req, res) => {
  const parsed = createPriceListSchema.parse(req.body);
  const data = await PriceListService.createForKelurahan(req.user, parsed);
  return created(res, data, "Kelurahan price list created");
});

export const listPriceList = asyncHandler(async (req, res) => {
  const data = await PriceListService.list(req.query);
  return ok(res, data, "Price list");
});
