import prisma from "../config/database.js";

export const DepositRequestsRepo = {
  create: (data) => prisma.deposit_requests.create({ data }),
  findById: (request_id) =>
    prisma.deposit_requests.findUnique({ where: { request_id } }),
  listMine: (user_id) =>
    prisma.deposit_requests.findMany({
      where: { user_id },
      orderBy: { created_at: "desc" },
    }),
  update: (request_id, data) =>
    prisma.deposit_requests.update({ where: { request_id }, data }),
};
