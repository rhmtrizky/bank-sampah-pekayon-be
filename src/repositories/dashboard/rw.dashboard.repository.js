import prisma from "../../config/database.js";

export const RwDashboardRepository = {
  async todayAggregates(rwId) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const agg = await prisma.transactions.aggregate({
      where: { rw_id: rwId, created_at: { gte: start, lte: end } },
      _count: { transaction_id: true },
      _sum: { weight_kg: true, total_amount: true },
    });

    return {
      total_transactions: agg._count.transaction_id || 0,
      total_weight: agg._sum.weight_kg ? Number(agg._sum.weight_kg) : 0,
      total_amount: agg._sum.total_amount ? Number(agg._sum.total_amount) : 0,
    };
  },

  async pendingRequestsCount(rwId) {
    const count = await prisma.deposit_requests.count({
      where: { rw_id: rwId, status: "pending" },
    });
    return count;
  },

  async activeWargaCount(rwId) {
    const count = await prisma.users.count({
      where: { rw: rwId, role: "warga" },
    });
    return count;
  },

  async activeRtCount(rwId) {
    const rts = await prisma.users.findMany({
      where: { rw: rwId, role: "warga", rt: { not: null } },
      select: { rt: true },
      distinct: ["rt"],
    });
    return rts.length;
  },

  async transactionsDaily(rwId, days) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const rows = await prisma.transactions.groupBy({
      by: ["created_at"],
      where: { rw_id: rwId, created_at: { gte: since } },
      _count: { transaction_id: true },
    });
    // normalize by date (YYYY-MM-DD)
    const map = rows.map((r) => ({
      date: r.created_at.toISOString().substring(0, 10),
      count: r._count.transaction_id,
    }));
    return map;
  },

  async weightDaily(rwId, days) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const rows = await prisma.transactions.groupBy({
      by: ["created_at"],
      where: { rw_id: rwId, created_at: { gte: since } },
      _sum: { weight_kg: true },
    });
    const map = rows.map((r) => ({
      date: r.created_at.toISOString().substring(0, 10),
      total_weight: r._sum.weight_kg ? Number(r._sum.weight_kg) : 0,
    }));
    return map;
  },

  async wasteComposition(rwId) {
    const rows = await prisma.transactions.groupBy({
      by: ["waste_type_id"],
      where: { rw_id: rwId },
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

  async recentTransactions(rwId, limit) {
    const tx = await prisma.transactions.findMany({
      where: { rw_id: rwId },
      orderBy: { created_at: "desc" },
      take: limit,
      select: {
        transaction_id: true,
        user_id: true,
        waste_type_id: true,
        weight_kg: true,
        total_amount: true,
        transaction_method: true,
        created_at: true,
      },
    });
    return tx.map((t) => ({
      ...t,
      weight_kg: Number(t.weight_kg),
      total_amount: Number(t.total_amount),
    }));
  },

  async recentRequests(rwId, limit) {
    // Default simple fetch (legacy) page=1
    return this.recentRequestsPaginated(rwId, 1, limit);
  },

  async recentRequestsPaginated(rwId, page, limit) {
    const skip = (page - 1) * limit;
    const [total, rows] = await Promise.all([
      prisma.deposit_requests.count({ where: { rw_id: rwId } }),
      prisma.deposit_requests.findMany({
        where: { rw_id: rwId },
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: { user: { select: { user_id: true, name: true, rt: true } } },
      }),
    ]);
    return {
      data: rows.map((r) => ({
        request_id: r.request_id,
        user: r.user,
        status: r.status,
        scheduled_date: r.scheduled_date,
        created_at: r.created_at,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  async rtStatistics(rwId) {
    // group by rt for transactions: total_weight and total_transactions
    const rows = await prisma.transactions.groupBy({
      by: ["rt"],
      where: { rw_id: rwId },
      _count: { transaction_id: true },
      _sum: { weight_kg: true },
    });
    const stats = rows
      .filter((r) => r.rt !== null)
      .map((r) => ({
        rt: r.rt,
        total_transactions: r._count.transaction_id,
        total_weight: r._sum.weight_kg ? Number(r._sum.weight_kg) : 0,
      }))
      .sort((a, b) => b.total_weight - a.total_weight);
    return stats;
  },

  async salesSummary(rwId) {
    const agg = await prisma.bulk_sales.aggregate({
      where: { rw_id: rwId },
      _sum: { total_weight: true, total_amount: true },
    });
    return {
      total_weight: agg._sum.total_weight ? Number(agg._sum.total_weight) : 0,
      total_amount: agg._sum.total_amount ? Number(agg._sum.total_amount) : 0,
    };
  },

  async recentSales(rwId, limit) {
    const rows = await prisma.bulk_sales.findMany({
      where: { rw_id: rwId },
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

  async todayCollectionSchedules(rwId) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return prisma.collection_schedules.findMany({
      where: { rw_id: rwId, date: { gte: start, lte: end } },
      orderBy: { start_time: "asc" },
      take: 10,
    });
  },

  async upcomingCollectionSchedules(rwId) {
    const now = new Date();
    return prisma.collection_schedules.findMany({
      where: { rw_id: rwId, date: { gte: now } },
      orderBy: { date: "asc" },
      take: 10,
    });
  },

  async upcomingWithdrawSchedules(rwId) {
    const now = new Date();
    return prisma.withdraw_schedules.findMany({
      where: { rw_id: rwId, date: { gte: now } },
      orderBy: { date: "asc" },
      take: 10,
    });
  },

  async unreadNotifications(userId, rwId) {
    const count = await prisma.notifications.count({
      where: {
        OR: [{ user_id: userId }, { rw_id: rwId }],
        is_read: false,
      },
    });
    return count;
  },
};
