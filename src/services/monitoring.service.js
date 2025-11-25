import prisma from "../config/database.js";
import { AppError } from "../utils/errors.js";

export const MonitoringService = {
  async rwActivity(user) {
    // kelurahan user sees only its RW; others (kelurahan param missing) may see all (e.g., admin not defined yet)
    const kelId = user.role === "kelurahan" ? user.kelurahan_id : undefined;

    const rws = await prisma.rw_list.findMany({
      where: kelId ? { kelurahan_id: kelId } : {},
      select: { rw_id: true, nomor_rw: true },
    });

    const txAgg = await prisma.transactions.groupBy({
      by: ["rw_id"],
      where: kelId ? { rw_list: { kelurahan_id: kelId } } : {},
      _sum: { weight_kg: true, total_amount: true },
      _count: { transaction_id: true },
    });

    const userCounts = await prisma.users.groupBy({
      by: ["rw"],
      where: {
        role: "warga",
        rw: { not: null },
        ...(kelId ? { rw_list: { kelurahan_id: kelId } } : {}),
      },
      _count: { user_id: true },
    });

    const txMap = new Map(txAgg.map((a) => [a.rw_id, a]));
    const userMap = new Map(userCounts.map((u) => [u.rw, u]));

    const rows = rws.map((r) => {
      const t = txMap.get(r.rw_id);
      const u = userMap.get(r.rw_id);
      return {
        rw_id: r.rw_id,
        nomor_rw: r.nomor_rw,
        total_transactions: t?._count.transaction_id || 0,
        total_weight: t?._sum.weight_kg ? Number(t._sum.weight_kg) : 0,
        total_revenue: t?._sum.total_amount ? Number(t._sum.total_amount) : 0,
        warga_count: u?._count.user_id || 0,
        active: (t?._count.transaction_id || 0) > 0,
      };
    });

    const activeCount = rows.filter((r) => r.active).length;
    return {
      total_rw: rows.length,
      active_rw: activeCount,
      inactive_rw: rows.length - activeCount,
      rows,
    };
  },

  async rtActivity(user, rw_id) {
    const targetRw = rw_id || user.rw;
    if (!targetRw) throw new AppError(400, "RW ID required");
    if (user.role === "rw" && targetRw !== user.rw)
      throw new AppError(403, "Cannot access other RW");
    if (user.role === "kelurahan") {
      // ensure RW belongs to kelurahan
      const rwRow = await prisma.rw_list.findUnique({
        where: { rw_id: targetRw },
      });
      if (!rwRow || rwRow.kelurahan_id !== user.kelurahan_id)
        throw new AppError(403, "RW not in kelurahan");
    }

    const wargaGroup = await prisma.users.groupBy({
      by: ["rt"],
      where: { rw: targetRw, role: "warga" },
      _count: { user_id: true },
    });

    const txGroup = await prisma.transactions.groupBy({
      by: ["rt"],
      where: { rw_id: targetRw },
      _count: { transaction_id: true },
    });

    const txMap = new Map(txGroup.map((t) => [t.rt, t]));
    const rows = wargaGroup.map((w) => ({
      rt: w.rt,
      warga_count: w._count.user_id,
      transaction_count: txMap.get(w.rt)?._count.transaction_id || 0,
      active: (txMap.get(w.rt)?._count.transaction_id || 0) > 0,
    }));

    return { rw_id: targetRw, rows };
  },
};
