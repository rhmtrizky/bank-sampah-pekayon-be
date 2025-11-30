import { RwDashboardRepository } from "../../repositories/dashboard/rw.dashboard.repository.js";

export const RwDashboardService = {
  async summary(rwId) {
    const [todayAgg, pendingReq, activeWarga, rtActive] = await Promise.all([
      RwDashboardRepository.todayAggregates(rwId),
      RwDashboardRepository.pendingRequestsCount(rwId),
      RwDashboardRepository.activeWargaCount(rwId),
      RwDashboardRepository.activeRtCount(rwId),
    ]);
    return {
      total_transactions_today: todayAgg.total_transactions,
      total_weight_today: todayAgg.total_weight,
      total_amount_today: todayAgg.total_amount,
      total_deposit_requests_pending: pendingReq,
      total_active_warga_in_rw: activeWarga,
      total_rt_active: rtActive,
    };
  },

  async transactionsDaily(rwId, days) {
    return RwDashboardRepository.transactionsDaily(rwId, days);
  },

  async weightDaily(rwId, days) {
    return RwDashboardRepository.weightDaily(rwId, days);
  },

  async wasteComposition(rwId) {
    return RwDashboardRepository.wasteComposition(rwId);
  },

  async recentTransactions(rwId, limit) {
    return RwDashboardRepository.recentTransactions(rwId, limit);
  },

  async recentRequests(rwId, page, limit) {
    return RwDashboardRepository.recentRequestsPaginated(rwId, page, limit);
  },

  async rtStatistics(rwId) {
    return RwDashboardRepository.rtStatistics(rwId);
  },

  async salesSummary(rwId) {
    return RwDashboardRepository.salesSummary(rwId);
  },

  async recentSales(rwId, limit) {
    return RwDashboardRepository.recentSales(rwId, limit);
  },

  async alerts(rwId, userId) {
    const [
      pendingRequests,
      todaySchedules,
      upcomingWithdraw,
      unreadNotifications,
    ] = await Promise.all([
      RwDashboardRepository.pendingRequestsCount(rwId),
      RwDashboardRepository.todayCollectionSchedules(rwId),
      RwDashboardRepository.upcomingWithdrawSchedules(rwId),
      RwDashboardRepository.unreadNotifications(userId, rwId),
    ]);
    return {
      pending_requests: pendingRequests,
      today_collection_schedules: todaySchedules,
      upcoming_withdraw_schedules: upcomingWithdraw,
      unread_notifications: unreadNotifications,
    };
  },

  async schedules(rwId) {
    const [nextCollection, nextWithdraw] = await Promise.all([
      RwDashboardRepository.upcomingCollectionSchedules(rwId),
      RwDashboardRepository.upcomingWithdrawSchedules(rwId),
    ]);
    return {
      next_collection_schedules: nextCollection,
      next_withdraw_schedules: nextWithdraw,
    };
  },
};
