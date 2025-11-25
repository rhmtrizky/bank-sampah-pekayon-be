import prisma from "../config/database.js";
import { AppError } from "../utils/errors.js";

function monthRange(year, month) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end };
}

function decToNumber(dec) {
  if (dec == null) return 0;
  return Number(dec);
}

export const ReportsService = {
  async rwMonthly(user, { rw_id, month, year }) {
    const targetRw = rw_id || user.rw;
    if (!targetRw) throw new AppError(400, "RW ID required");
    if (user.role === "rw" && targetRw !== user.rw)
      throw new AppError(403, "Cannot access other RW report");
    const { start, end } = monthRange(year, month);

    const agg = await prisma.transactions.aggregate({
      where: { rw_id: targetRw, created_at: { gte: start, lt: end } },
      _sum: { weight_kg: true, total_amount: true },
      _count: { transaction_id: true },
    });

    return {
      scope: "rw",
      rw_id: targetRw,
      month,
      year,
      total_transactions: agg._count.transaction_id || 0,
      total_weight: decToNumber(agg._sum.weight_kg),
      total_revenue: decToNumber(agg._sum.total_amount),
      total_withdraw: 0, // placeholder until withdraw implemented
    };
  },

  async kelurahanMonthly(user, { kelurahan_id, month, year }) {
    const targetKel = kelurahan_id || user.kelurahan_id;
    if (!targetKel) throw new AppError(400, "Kelurahan ID required");
    if (user.role === "kelurahan" && targetKel !== user.kelurahan_id)
      throw new AppError(403, "Cannot access other kelurahan report");
    const { start, end } = monthRange(year, month);

    // transactions from RW under kelurahan
    const rwTransactionsAgg = await prisma.transactions.groupBy({
      by: ["rw_id"],
      where: {
        created_at: { gte: start, lt: end },
        rw_list: { kelurahan_id: targetKel },
      },
      _sum: { weight_kg: true, total_amount: true },
      _count: { transaction_id: true },
    });

    // PPSU (kelurahan) transactions (kelurahan_id field)
    const ppsuAgg = await prisma.transactions.aggregate({
      where: { kelurahan_id: targetKel, created_at: { gte: start, lt: end } },
      _sum: { weight_kg: true, total_amount: true },
      _count: { transaction_id: true },
    });

    const totalTransactions =
      rwTransactionsAgg.reduce((a, r) => a + r._count.transaction_id, 0) +
      (ppsuAgg._count.transaction_id || 0);
    const totalWeight =
      rwTransactionsAgg.reduce((a, r) => a + decToNumber(r._sum.weight_kg), 0) +
      decToNumber(ppsuAgg._sum.weight_kg);
    const totalRevenue =
      rwTransactionsAgg.reduce(
        (a, r) => a + decToNumber(r._sum.total_amount),
        0
      ) + decToNumber(ppsuAgg._sum.total_amount);

    return {
      scope: "kelurahan",
      kelurahan_id: targetKel,
      month,
      year,
      total_transactions: totalTransactions,
      total_weight: totalWeight,
      total_revenue: totalRevenue,
      total_withdraw: 0, // placeholder
      breakdown: {
        rw: rwTransactionsAgg.map((r) => ({
          rw_id: r.rw_id,
          transactions: r._count.transaction_id,
          weight: decToNumber(r._sum.weight_kg),
          revenue: decToNumber(r._sum.total_amount),
        })),
        ppsu: {
          transactions: ppsuAgg._count.transaction_id || 0,
          weight: decToNumber(ppsuAgg._sum.weight_kg),
          revenue: decToNumber(ppsuAgg._sum.total_amount),
        },
      },
    };
  },
};
