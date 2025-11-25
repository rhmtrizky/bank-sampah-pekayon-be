import prisma from "../config/database.js";

export const BulkSalesRepo = {
  createSale: (data) => prisma.bulk_sales.create({ data }),
  createItems: (items) => prisma.bulk_sale_items.createMany({ data: items }),
  list: ({ rw_id, kelurahan_id } = {}) => {
    const where = {};
    if (rw_id) where.rw_id = rw_id;
    if (kelurahan_id) where.kelurahan_id = kelurahan_id;
    return prisma.bulk_sales.findMany({
      where,
      orderBy: { date: "desc" },
      include: { items: true, pengepul: true },
    });
  },
  findById: (sale_id) =>
    prisma.bulk_sales.findUnique({
      where: { sale_id },
      include: { items: true, pengepul: true },
    }),
};
