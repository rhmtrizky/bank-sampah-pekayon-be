import prisma from "../config/database.js";

export const WasteTypesRepo = {
  create: (data) => prisma.waste_types.create({ data }),
  list: () => prisma.waste_types.findMany({ orderBy: { created_at: "desc" } }),
  findById: (waste_type_id) =>
    prisma.waste_types.findUnique({ where: { waste_type_id } }),
  update: (waste_type_id, data) =>
    prisma.waste_types.update({ where: { waste_type_id }, data }),
  delete: (waste_type_id) =>
    prisma.waste_types.delete({ where: { waste_type_id } }),
};
