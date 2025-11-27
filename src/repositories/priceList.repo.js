import prisma from "../config/database.js";

export const PriceListRepo = {
  findLatestByRwAndWaste(rw_id, waste_type_id) {
    return prisma.price_list.findFirst({
      where: { rw_id, waste_type_id },
      orderBy: { effective_date: "desc" },
    });
  },
  findLatestByKelurahanAndWaste(kelurahan_id, waste_type_id) {
    return prisma.price_list.findFirst({
      where: { kelurahan_id, waste_type_id },
      orderBy: { effective_date: "desc" },
    });
  },
  create(data) {
    return prisma.price_list.create({ data });
  },
  list({ rw_id, kelurahan_id } = {}) {
    const where = {};
    if (rw_id) where.rw_id = rw_id;
    if (kelurahan_id) where.kelurahan_id = kelurahan_id;
    return prisma.price_list.findMany({
      where,
      include: { waste_type: true, rw_list: true, kelurahan: true },
      orderBy: { effective_date: "desc" },
    });
  },
};
