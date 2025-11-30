import {
  createPriceListSchema,
  updatePriceListSchema,
} from "../validations/wasteTypes.validation.js";
import { PriceListService } from "../services/priceList.service.js";
import { asyncHandler } from "../utils/errors.js";
import { created, ok } from "../utils/response.js";

export const listPriceListByRwPaginated = asyncHandler(async (req, res) => {
  const rw_id = Number(req.params.rw_id);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  if (Number.isNaN(rw_id)) {
    return ok(res, { data: [], total: 0, page, limit }, "Invalid rw_id");
  }
  const data = await PriceListService.listPaginated({ rw_id, page, limit });
  return ok(res, data, "Paginated price list by rw_id");
});

export const listPriceListByKelurahanPaginated = asyncHandler(
  async (req, res) => {
    const kelurahan_id = Number(req.params.kelurahan_id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    if (Number.isNaN(kelurahan_id)) {
      return ok(
        res,
        { data: [], total: 0, page, limit },
        "Invalid kelurahan_id"
      );
    }
    const data = await PriceListService.listPaginated({
      kelurahan_id,
      page,
      limit,
    });
    return ok(res, data, "Paginated price list by kelurahan_id");
  }
);

export const updatePriceListRw = asyncHandler(async (req, res) => {
  const price_id = Number(req.params.price_id);
  const parsed = updatePriceListSchema.parse(req.body);
  const data = await PriceListService.updateForRw(req.user, price_id, parsed);
  return ok(res, data, "RW price list updated");
});

export const deletePriceListRw = asyncHandler(async (req, res) => {
  const price_id = Number(req.params.price_id);
  const data = await PriceListService.deleteForRw(req.user, price_id);
  return ok(res, data, "RW price list deleted");
});

export const updatePriceListKelurahan = asyncHandler(async (req, res) => {
  const price_id = Number(req.params.price_id);
  const parsed = updatePriceListSchema.parse(req.body);
  const data = await PriceListService.updateForKelurahan(
    req.user,
    price_id,
    parsed
  );
  return ok(res, data, "Kelurahan price list updated");
});

export const deletePriceListKelurahan = asyncHandler(async (req, res) => {
  const price_id = Number(req.params.price_id);
  const data = await PriceListService.deleteForKelurahan(req.user, price_id);
  return ok(res, data, "Kelurahan price list deleted");
});

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

export const listPriceListByRw = asyncHandler(async (req, res) => {
  const rw_id = Number(req.params.rw_id);
  if (Number.isNaN(rw_id)) {
    return ok(res, [], "Invalid rw_id");
  }
  const data = await PriceListService.list({ rw_id });
  return ok(res, data, "Price list by rw_id");
});
