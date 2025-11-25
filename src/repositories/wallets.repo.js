import prisma from "../config/database.js";

export const WalletsRepo = {
  create: (data) => prisma.wallets.create({ data }),
  findByUserId: (user_id) => prisma.wallets.findUnique({ where: { user_id } }),
  updateBalance: (user_id, amountDelta) =>
    prisma.$transaction(async (tx) => {
      const wallet = await tx.wallets.findUnique({ where: { user_id } });
      const current = wallet ? Number(wallet.balance) : 0;
      const updated = await tx.wallets.upsert({
        where: { user_id },
        create: {
          user_id,
          balance: (current + Number(amountDelta)).toFixed(2),
        },
        update: { balance: (current + Number(amountDelta)).toFixed(2) },
      });
      return updated;
    }),
};
