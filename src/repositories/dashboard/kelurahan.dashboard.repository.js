import prisma from "../../config/database.js";

export const KelurahanDashboardRepository = {
  async totalRw(kelurahanId) {
    return prisma.rw_list.count({
      where: { kelurahan_id: kelurahanId, active: true },
    });
  },

  async todayAggregatesAllRw(kelurahanId) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const agg = await prisma.transactions.aggregate({
      where: {
        rw_list: { kelurahan_id: kelurahanId },
        created_at: { gte: start, lte: end },
      },
      _count: { transaction_id: true },
      _sum: { weight_kg: true },
    });
    return {
      total_transactions: agg._count.transaction_id || 0,
      total_weight: agg._sum.weight_kg ? Number(agg._sum.weight_kg) : 0,
    };
  },

  async totalSalesAllRw(kelurahanId) {
    const agg = await prisma.bulk_sales.aggregate({
      where: { rw_list: { kelurahan_id: kelurahanId } },
      _sum: { total_amount: true },
    });
    return {
      total_amount: agg._sum.total_amount ? Number(agg._sum.total_amount) : 0,
    };
  },

  async totalActiveWarga(kelurahanId) {
    return prisma.users.count({
      where: { kelurahan_id: kelurahanId, role: "warga" },
    });
  },

  async rwPerformance(kelurahanId) {
    // For each RW: total_weight_this_month, total_transactions
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const rows = await prisma.transactions.groupBy({
      by: ["rw_id"],
      where: {
        rw_list: { kelurahan_id: kelurahanId },
        created_at: { gte: monthStart },
      },
      _count: { transaction_id: true },
      _sum: { weight_kg: true },
    });
    const rwInfo = await prisma.rw_list.findMany({
      where: { kelurahan_id: kelurahanId },
      select: { rw_id: true, nomor_rw: true, name: true },
    });
    const infoById = new Map(rwInfo.map((r) => [r.rw_id, r]));
    return rows.map((r) => ({
      rw_id: r.rw_id,
      nomor_rw: infoById.get(r.rw_id)?.nomor_rw || null,
      name: infoById.get(r.rw_id)?.name || null,
      total_transactions: r._count.transaction_id,
      total_weight_this_month: r._sum.weight_kg ? Number(r._sum.weight_kg) : 0,
    }));
  },

  async weightMonthly(kelurahanId, months) {
    const now = new Date();
    const since = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
    // Group by year-month using created_at date; we'll post-process
    const rows = await prisma.transactions.findMany({
      where: {
        rw_list: { kelurahan_id: kelurahanId },
        created_at: { gte: since },
      },
      select: { created_at: true, weight_kg: true },
    });
    const map = new Map();
    for (const r of rows) {
      const d = r.created_at;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const prev = map.get(key) || 0;
      map.set(key, prev + Number(r.weight_kg));
    }
    return Array.from(map.entries()).map(([month, total_weight]) => ({
      month,
      total_weight,
    }));
  },

  async recentTransactions(kelurahanId, limit) {
    const tx = await prisma.transactions.findMany({
      where: { rw_list: { kelurahan_id: kelurahanId } },
      orderBy: { created_at: "desc" },
      take: limit,
      select: {
        transaction_id: true,
        rw_id: true,
        user_id: true,
        waste_type_id: true,
        weight_kg: true,
        total_amount: true,
        created_at: true,
      },
    });
    return tx.map((t) => ({
      ...t,
      weight_kg: Number(t.weight_kg),
      total_amount: Number(t.total_amount),
    }));
  },

  async recentSales(kelurahanId, limit) {
    const rows = await prisma.bulk_sales.findMany({
      where: {
        OR: [
          { rw_list: { kelurahan_id: kelurahanId } },
          { kelurahan_rel: { kelurahan_id: kelurahanId } },
        ],
      },
      orderBy: { date: "desc" },
      take: limit,
      select: {
        sale_id: true,
        total_weight: true,
        total_amount: true,
        date: true,
        pengepul_id: true,
      },
    });
    return rows.map((r) => ({
      ...r,
      total_weight: Number(r.total_weight),
      total_amount: Number(r.total_amount),
    }));
  },

  async rwRanking(kelurahanId) {
    // Rank RW by weight, transactions, and sales
    const weightTx = await prisma.transactions.groupBy({
      by: ["rw_id"],
      where: { rw_list: { kelurahan_id: kelurahanId } },
      _count: { transaction_id: true },
      _sum: { weight_kg: true },
    });
    const sales = await prisma.bulk_sales.groupBy({
      by: ["rw_id"],
      where: { rw_list: { kelurahan_id: kelurahanId } },
      _sum: { total_amount: true },
    });
    const salesByRw = new Map(
      sales.map((s) => [
        s.rw_id,
        s._sum.total_amount ? Number(s._sum.total_amount) : 0,
      ])
    );
    const ranking = weightTx
      .map((r) => ({
        rw_id: r.rw_id,
        total_transactions: r._count.transaction_id,
        total_weight: r._sum.weight_kg ? Number(r._sum.weight_kg) : 0,
        total_sales_amount: salesByRw.get(r.rw_id) || 0,
      }))
      .sort(
        (a, b) =>
          b.total_weight +
          b.total_transactions +
          b.total_sales_amount -
          (a.total_weight + a.total_transactions + a.total_sales_amount)
      );
    return ranking;
  },

  async wasteComposition(kelurahanId) {
    const rows = await prisma.transactions.groupBy({
      by: ["waste_type_id"],
      where: { rw_list: { kelurahan_id: kelurahanId } },
      _sum: { weight_kg: true },
    });
    const types = await prisma.waste_types.findMany({
      where: { waste_type_id: { in: rows.map((r) => r.waste_type_id) } },
      select: { waste_type_id: true, name: true },
    });
    const nameById = new Map(types.map((t) => [t.waste_type_id, t.name]));
    return rows.map((r) => ({
      waste_type_id: r.waste_type_id,
      waste_type_name: nameById.get(r.waste_type_id) || "Unknown",
      total_weight: r._sum.weight_kg ? Number(r._sum.weight_kg) : 0,
    }));
  },

  async rwNoActivityThisMonth(kelurahanId) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const activeRwIds = await prisma.transactions.findMany({
      where: { kelurahan_id: kelurahanId, created_at: { gte: monthStart } },
      select: { rw_id: true },
      distinct: ["rw_id"],
    });
    const activeSet = new Set(activeRwIds.map((r) => r.rw_id));
    const allRw = await prisma.rw_list.findMany({
      where: { kelurahan_id: kelurahanId, active: true },
      select: { rw_id: true, nomor_rw: true, name: true },
    });
    return allRw.filter((r) => !activeSet.has(r.rw_id));
  },

  async rtAnomalies(kelurahanId) {
    // RT with 0 activity (no transactions) in this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const txByRt = await prisma.transactions.groupBy({
      by: ["rw_id", "rt"],
      where: { kelurahan_id: kelurahanId, created_at: { gte: monthStart } },
      _count: { transaction_id: true },
    });
    // Get all RTs from users table
    const warga = await prisma.users.findMany({
      where: { kelurahan_id: kelurahanId, role: "warga", rt: { not: null } },
      select: { rw: true, rt: true },
    });
    const seen = new Set(
      txByRt.filter((r) => r.rt !== null).map((r) => `${r.rw_id}:${r.rt}`)
    );
    const anomalies = [];
    for (const u of warga) {
      if (u.rw == null || u.rt == null) continue;
      const key = `${u.rw}:${u.rt}`;
      if (!seen.has(key)) {
        anomalies.push({ rw_id: u.rw, rt: u.rt });
      }
    }
    return anomalies;
  },

  async unreadNotifications(userId, kelurahanId) {
    const count = await prisma.notifications.count({
      where: {
        OR: [{ user_id: userId }, { kelurahan_id: kelurahanId }],
        is_read: false,
      },
    });
    return count;
  },
};
