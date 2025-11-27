import prisma from "../config/database.js";

export const UsersRepo = {
  create: (data) => prisma.users.create({ data }),
  findById: (user_id) => prisma.users.findUnique({ where: { user_id } }),
  findByEmail: (email) => prisma.users.findUnique({ where: { email } }),
  findByPhone: (phone) => prisma.users.findFirst({ where: { phone } }),
  updateById: (user_id, data) =>
    prisma.users.update({ where: { user_id }, data }),
};
