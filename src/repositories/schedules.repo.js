import prisma from "../config/database.js";

export const CollectionSchedulesRepo = {
  create: (data) => prisma.collection_schedules.create({ data }),
  findById: (id) =>
    prisma.collection_schedules.findUnique({ where: { schedule_id: id } }),
  update: (id, data) =>
    prisma.collection_schedules.update({ where: { schedule_id: id }, data }),
  delete: (id) =>
    prisma.collection_schedules.delete({ where: { schedule_id: id } }),
  list: async ({ rw_id, kelurahan_id, page = 1, limit = 10 } = {}) => {
    const where = {};
    if (rw_id) where.rw_id = rw_id;
    if (kelurahan_id) where.kelurahan_id = kelurahan_id;
    const skip = (page - 1) * limit;
    const [total, rows] = await Promise.all([
      prisma.collection_schedules.count({ where }),
      prisma.collection_schedules.findMany({
        where,
        orderBy: [{ date: "asc" }, { start_time: "asc" }],
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
};

export const WithdrawSchedulesRepo = {
  create: (data) => prisma.withdraw_schedules.create({ data }),
  findById: (id) =>
    prisma.withdraw_schedules.findUnique({
      where: { withdraw_schedule_id: id },
    }),
  update: (id, data) =>
    prisma.withdraw_schedules.update({
      where: { withdraw_schedule_id: id },
      data,
    }),
  delete: (id) =>
    prisma.withdraw_schedules.delete({ where: { withdraw_schedule_id: id } }),
  list: async ({ rw_id, kelurahan_id, page = 1, limit = 10 } = {}) => {
    const where = {};
    if (rw_id) where.rw_id = rw_id;
    if (kelurahan_id) where.kelurahan_id = kelurahan_id;
    const skip = (page - 1) * limit;
    const [total, rows] = await Promise.all([
      prisma.withdraw_schedules.count({ where }),
      prisma.withdraw_schedules.findMany({
        where,
        orderBy: [{ date: "asc" }, { start_time: "asc" }],
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
};
