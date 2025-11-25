import prisma from "../config/database.js";

export const WalletHistoryRepo = {
  create: (data) => prisma.wallet_history.create({ data }),
  listByUser: (user_id, { skip = 0, take = 50 } = {}) =>
    prisma.wallet_history.findMany({
      where: { user_id },
      orderBy: { created_at: "desc" },
      skip,
      take,
    }),
};
