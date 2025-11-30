import prisma from "../config/database.js";

export const UsersRepo = {
  create: (data) => prisma.users.create({ data }),
  findById: (user_id) => prisma.users.findUnique({ where: { user_id } }),
  findByEmail: (email) => prisma.users.findUnique({ where: { email } }),
  findByPhone: (phone) => prisma.users.findFirst({ where: { phone } }),
  updateById: (user_id, data) =>
    prisma.users.update({ where: { user_id }, data }),
  listByRwPaginated: async (rw, { page = 1, limit = 20, name, phone } = {}) => {
    const where = { role: "warga", rw };
    const skip = (page - 1) * limit;
    const filter =
      name || phone
        ? {
            OR: [
              ...(name
                ? [{ name: { contains: name, mode: "insensitive" } }]
                : []),
              ...(phone
                ? [{ phone: { contains: phone, mode: "insensitive" } }]
                : []),
            ],
          }
        : {};
    const [total, data] = await Promise.all([
      prisma.users.count({ where: { ...where, ...filter } }),
      prisma.users.findMany({
        where: { ...where, ...filter },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        select: {
          user_id: true,
          name: true,
          email: true,
          phone: true,
          alamat: true,
          rt: true,
          rw: true,
          kelurahan_id: true,
          created_at: true,
        },
      }),
    ]);
    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};
