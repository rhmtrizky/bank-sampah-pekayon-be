// Duplicate block removed
import { PriceListRepo } from "../repositories/priceList.repo.js";
import { WasteTypesRepo } from "../repositories/wasteTypes.repo.js";
import { AppError } from "../utils/errors.js";

function toDec(num, digits = 2) {
  return Number(num).toFixed(digits);
}

export const PriceListService = {
  async listPaginated(query) {
    const { rw_id, kelurahan_id, page = 1, limit = 10 } = query;
    const parsedRw = rw_id ? Number(rw_id) : undefined;
    const parsedKel = kelurahan_id ? Number(kelurahan_id) : undefined;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      PriceListRepo.listPaginated({
        rw_id: parsedRw,
        kelurahan_id: parsedKel,
        skip,
        take: limit,
      }),
      PriceListRepo.count({ rw_id: parsedRw, kelurahan_id: parsedKel }),
    ]);
    return { data, total, page, limit };
  },
  async createForRw(user, payload) {
    if (user.role !== "rw")
      throw new AppError(403, "Only RW can create RW price list");
    const wt = await WasteTypesRepo.findById(payload.waste_type_id);
    if (!wt) throw new AppError(404, "Waste type not found");
    return PriceListRepo.create({
      waste_type_id: payload.waste_type_id,
      kelurahan_id: 1,
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

  async updateForRw(user, price_id, payload) {
    if (user.role !== "rw")
      throw new AppError(403, "Only RW can update RW price list");
    // Optionally: check ownership by fetching and comparing rw_id
    return PriceListRepo.update(price_id, payload);
  },

  async deleteForRw(user, price_id) {
    if (user.role !== "rw")
      throw new AppError(403, "Only RW can delete RW price list");
    // Optionally: check ownership by fetching and comparing rw_id
    return PriceListRepo.delete(price_id);
  },

  async updateForKelurahan(user, price_id, payload) {
    if (user.role !== "kelurahan")
      throw new AppError(403, "Only Kelurahan can update kelurahan price list");
    // Optionally: check ownership by fetching and comparing kelurahan_id
    return PriceListRepo.update(price_id, payload);
  },

  async deleteForKelurahan(user, price_id) {
    if (user.role !== "kelurahan")
      throw new AppError(403, "Only Kelurahan can delete kelurahan price list");
    // Optionally: check ownership by fetching and comparing kelurahan_id
    return PriceListRepo.delete(price_id);
  },
};
