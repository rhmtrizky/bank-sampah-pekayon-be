import prisma from "../config/database.js";

export const TransactionsRepo = {
  create: (data) => prisma.transactions.create({ data }),
  findById: (transaction_id) =>
    prisma.transactions.findUnique({ where: { transaction_id } }),
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
};
