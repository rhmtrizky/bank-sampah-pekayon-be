import { AppError } from "../utils/errors.js";
import { PengepulRepo } from "../repositories/pengepul.repo.js";
import { BulkSalesRepo } from "../repositories/bulkSales.repo.js";
import { WasteTypesRepo } from "../repositories/wasteTypes.repo.js";
import { PriceListRepo } from "../repositories/priceList.repo.js";

function toDec(num, digits = 2) {
  return Number(num).toFixed(digits);
}

export const BulkSalesService = {
  async createPengepul(user, payload) {
    if (!["rw", "kelurahan"].includes(user.role))
      throw new AppError(403, "Forbidden");
    return PengepulRepo.create({
      name: payload.name,
      phone: payload.phone || null,
      address: payload.address || null,
    });
  },
  async listPengepul(query = {}) {
    const page = query.page ? Number.parseInt(query.page, 10) : 1;
    const limit = query.limit ? Number.parseInt(query.limit, 10) : 10;
    const filters = {
      name: query.name || undefined,
      phone: query.phone || undefined,
    };
    return PengepulRepo.listPaginated(page, limit, filters);
  },

  async updatePengepul(user, id, payload) {
    if (!["rw", "kelurahan"].includes(user.role))
      throw new AppError(403, "Forbidden");
    const existing = await PengepulRepo.findById(id);
    if (!existing) throw new AppError(404, "Pengepul not found");
    return PengepulRepo.update(id, {
      name: payload.name,
      phone: payload.phone || null,
      address: payload.address || null,
    });
  },

  async deletePengepul(user, id) {
    if (!["rw", "kelurahan"].includes(user.role))
      throw new AppError(403, "Forbidden");
    const existing = await PengepulRepo.findById(id);
    if (!existing) throw new AppError(404, "Pengepul not found");
    await PengepulRepo.delete(id);
    return { deleted: true };
  },

  async createBulkSale(user, payload) {
    if (!["rw", "kelurahan"].includes(user.role))
      throw new AppError(403, "Forbidden");
    const pengepul = await PengepulRepo.findById(payload.pengepul_id);
    if (!pengepul) throw new AppError(404, "Pengepul not found");
    // Validate waste types & fetch prices
    let totalWeight = 0;
    let totalAmount = 0;
    const saleItems = [];

    for (const item of payload.items) {
      const wt = await WasteTypesRepo.findById(item.waste_type_id);
      if (!wt)
        throw new AppError(404, `Waste type ${item.waste_type_id} not found`);
      let priceEntry;
      if (user.role === "rw") {
        priceEntry = await PriceListRepo.findLatestByRwAndWaste(
          user.rw,
          item.waste_type_id
        );
      } else {
        priceEntry = await PriceListRepo.findLatestByKelurahanAndWaste(
          user.kelurahan_id,
          item.waste_type_id
        );
      }
      if (!priceEntry)
        throw new AppError(
          400,
          `Price list missing for waste type ${item.waste_type_id}`
        );
      const sellPrice = Number(priceEntry.sell_price);
      const weight = Number(item.weight_kg);
      const subtotal = sellPrice * weight;
      totalWeight += weight;
      totalAmount += subtotal;
      saleItems.push({
        waste_type_id: item.waste_type_id,
        weight_kg: toDec(weight, 3),
        price_per_kg: toDec(sellPrice, 2),
        subtotal: toDec(subtotal, 2),
      });
    }

    const sale = await BulkSalesRepo.createSale({
      rw_id: user.role === "rw" ? user.rw : null,
      kelurahan_id: user.role === "kelurahan" ? user.kelurahan_id : null,
      pengepul_id: payload.pengepul_id,
      total_weight: toDec(totalWeight, 3),
      total_amount: toDec(totalAmount, 2),
      date: payload.date ? new Date(payload.date) : new Date(),
    });

    await BulkSalesRepo.createItems(
      saleItems.map((i) => ({ ...i, sale_id: sale.sale_id }))
    );

    return BulkSalesRepo.findById(sale.sale_id);
  },

  async listBulkSales(query) {
    const { rw_id, kelurahan_id } = query;
    return BulkSalesRepo.list({
      rw_id: rw_id ? Number(rw_id) : undefined,
      kelurahan_id: kelurahan_id ? Number(kelurahan_id) : undefined,
    });
  },
};
