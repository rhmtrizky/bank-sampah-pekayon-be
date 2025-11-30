import prisma from "../config/database.js";

export const TransactionsRepo = {
  create: (data) => prisma.transactions.create({ data }),
  findById: (transaction_id) =>
    prisma.transactions.findUnique({ where: { transaction_id } }),
  update: (transaction_id, data) =>
    prisma.transactions.update({ where: { transaction_id }, data }),
  delete: (transaction_id) =>
    prisma.transactions.delete({ where: { transaction_id } }),
  listByRw: (rw_id, { month, year } = {}) => {
    const where = { rw_id };
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      where.created_at = { gte: start, lt: end };
    }
    return prisma.transactions.findMany({
      where,
      orderBy: { created_at: "desc" },
    });
  },
  listPaginatedByRw: async (
    rw_id,
    {
      month,
      year,
      page = 1,
      limit = 20,
      from_date,
      to_date,
      name,
      method,
      waste_type_id,
    } = {}
  ) => {
    const where = { rw_id };
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      where.created_at = { gte: start, lt: end };
    }
    if (from_date || to_date) {
      where.created_at = {
        ...(where.created_at || {}),
        ...(from_date ? { gte: new Date(from_date) } : {}),
        ...(to_date ? { lte: new Date(to_date) } : {}),
      };
    }
    if (method) {
      where.transaction_method = method;
    }
    if (waste_type_id) {
      where.waste_type_id = Number(waste_type_id);
    }
    const skip = (page - 1) * limit;
    const [total, data] = await Promise.all([
      prisma.transactions.count({
        where: {
          ...where,
          ...(name
            ? {
                user: {
                  name: { contains: name, mode: "insensitive" },
                },
              }
            : {}),
        },
      }),
      prisma.transactions.findMany({
        where: {
          ...where,
          ...(name
            ? {
                user: {
                  name: { contains: name, mode: "insensitive" },
                },
              }
            : {}),
        },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: {
          user: { select: { user_id: true, name: true } },
          waste_type: { select: { waste_type_id: true, name: true } },
        },
      }),
    ]);
    const mapped = data.map((t) => ({
      transaction_id: t.transaction_id,
      user_id: t.user_id,
      user_name: t.user?.name ?? null,
      rw_id: t.rw_id,
      kelurahan_id: t.kelurahan_id ?? null,
      waste_type_id: t.waste_type_id,
      waste_type_name: t.waste_type?.name ?? null,
      weight_kg: t.weight_kg,
      price_per_kg: t.price_per_kg,
      total_amount: t.total_amount,
      transaction_method: t.transaction_method,
      request_id: t.request_id ?? null,
      rt: t.rt ?? null,
      created_at: t.created_at,
    }));
    return {
      data: mapped,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};
