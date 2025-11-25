import prisma from "../config/database.js";

export const RwRepo = {
  create: (data) => prisma.rw_list.create({ data }),
  list: (kelurahan_id) =>
    prisma.rw_list.findMany({
      where: kelurahan_id ? { kelurahan_id } : {},
      orderBy: { rw_id: "desc" },
    }),
  findById: (rw_id) => prisma.rw_list.findUnique({ where: { rw_id } }),
  update: (rw_id, data) => prisma.rw_list.update({ where: { rw_id }, data }),
};
