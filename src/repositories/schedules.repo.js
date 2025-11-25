import prisma from "../config/database.js";

export const CollectionSchedulesRepo = {
  create: (data) => prisma.collection_schedules.create({ data }),
  list: ({ rw_id, kelurahan_id } = {}) => {
    const where = {};
    if (rw_id) where.rw_id = rw_id;
    if (kelurahan_id) where.kelurahan_id = kelurahan_id;
    return prisma.collection_schedules.findMany({
      where,
      orderBy: { date: "asc" },
    });
  },
};

export const WithdrawSchedulesRepo = {
  create: (data) => prisma.withdraw_schedules.create({ data }),
  list: ({ rw_id, kelurahan_id } = {}) => {
    const where = {};
    if (rw_id) where.rw_id = rw_id;
    if (kelurahan_id) where.kelurahan_id = kelurahan_id;
    return prisma.withdraw_schedules.findMany({
      where,
      orderBy: { date: "asc" },
    });
  },
};
