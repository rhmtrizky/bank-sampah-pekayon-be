import prisma from "../config/database.js";

export const PengepulRepo = {
  create: (data) => prisma.pengepul.create({ data }),
  listPaginated: async (page = 1, limit = 10, filters = {}) => {
    const skip = (page - 1) * limit;
    const where = {};
    if (filters.name) {
      where.name = { contains: filters.name, mode: "insensitive" };
    }
    if (filters.phone) {
      where.phone = { contains: filters.phone, mode: "insensitive" };
    }
    const [total, rows] = await Promise.all([
      prisma.pengepul.count({ where }),
      prisma.pengepul.findMany({
        where,
        orderBy: { pengepul_id: "desc" },
        skip,
        take: limit,
      }),
    ]);
    return {
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  },
  list: () => prisma.pengepul.findMany({ orderBy: { pengepul_id: "desc" } }),
  findById: (pengepul_id) =>
    prisma.pengepul.findUnique({ where: { pengepul_id } }),
  update: (pengepul_id, data) =>
    prisma.pengepul.update({ where: { pengepul_id }, data }),
  delete: (pengepul_id) => prisma.pengepul.delete({ where: { pengepul_id } }),
};
