import { PriceListRepo } from "../repositories/priceList.repo.js";
import { WasteTypesRepo } from "../repositories/wasteTypes.repo.js";
import { AppError } from "../utils/errors.js";

function toDec(num, digits = 2) {
  return Number(num).toFixed(digits);
}

export const PriceListService = {
  async createForRw(user, payload) {
    if (user.role !== "rw")
      throw new AppError(403, "Only RW can create RW price list");
    const wt = await WasteTypesRepo.findById(payload.waste_type_id);
    if (!wt) throw new AppError(404, "Waste type not found");
    return PriceListRepo.create({
      waste_type_id: payload.waste_type_id,
      rw_id: user.rw,
      buy_price: toDec(payload.buy_price),
      sell_price: toDec(payload.sell_price),
      effective_date: payload.effective_date
        ? new Date(payload.effective_date)
        : new Date(),
    });
  },
  async createForKelurahan(user, payload) {
    if (user.role !== "kelurahan")
      throw new AppError(403, "Only Kelurahan can create kelurahan price list");
    const wt = await WasteTypesRepo.findById(payload.waste_type_id);
    if (!wt) throw new AppError(404, "Waste type not found");
    if (!user.kelurahan_id)
      throw new AppError(400, "Kelurahan context missing");
    return PriceListRepo.create({
      waste_type_id: payload.waste_type_id,
      kelurahan_id: user.kelurahan_id,
      buy_price: toDec(payload.buy_price),
      sell_price: toDec(payload.sell_price),
      effective_date: payload.effective_date
        ? new Date(payload.effective_date)
        : new Date(),
    });
  },
  async list(query) {
    const { rw_id, kelurahan_id } = query;
    const parsedRw = rw_id ? Number(rw_id) : undefined;
    const parsedKel = kelurahan_id ? Number(kelurahan_id) : undefined;
    return PriceListRepo.list({ rw_id: parsedRw, kelurahan_id: parsedKel });
  },
};
