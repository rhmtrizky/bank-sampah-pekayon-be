import prisma from "../config/database.js";

export const PengepulRepo = {
  create: (data) => prisma.pengepul.create({ data }),
  list: () => prisma.pengepul.findMany({ orderBy: { pengepul_id: "desc" } }),
  findById: (pengepul_id) =>
    prisma.pengepul.findUnique({ where: { pengepul_id } }),
};
