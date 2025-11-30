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
  listPaginated({ rw_id, kelurahan_id, skip = 0, take = 10 } = {}) {
    const where = {};
    if (rw_id) where.rw_id = rw_id;
    if (kelurahan_id) where.kelurahan_id = kelurahan_id;
    return prisma.price_list.findMany({
      where,
      include: { waste_type: true, rw_list: true, kelurahan: true },
      orderBy: { effective_date: "desc" },
      skip,
      take,
    });
  },
  count({ rw_id, kelurahan_id } = {}) {
    const where = {};
    if (rw_id) where.rw_id = rw_id;
    if (kelurahan_id) where.kelurahan_id = kelurahan_id;
    return prisma.price_list.count({ where });
  },
  update(price_id, data) {
    return prisma.price_list.update({
      where: { price_id },
      data,
    });
  },
  delete(price_id) {
    return prisma.price_list.delete({
      where: { price_id },
    });
  },
};
