import prisma from "../config/database.js";

export const KelurahanRepo = {
  create: (data) => prisma.kelurahan.create({ data }),
  list: () => prisma.kelurahan.findMany({ orderBy: { kelurahan_id: "desc" } }),
  findById: (kelurahan_id) =>
    prisma.kelurahan.findUnique({ where: { kelurahan_id } }),
  update: (kelurahan_id, data) =>
    prisma.kelurahan.update({ where: { kelurahan_id }, data }),
};
