import { KelurahanDashboardRepository } from "../../repositories/dashboard/kelurahan.dashboard.repository.js";

export const KelurahanDashboardService = {
  async summary(kelurahanId) {
    const [rwCount, todayAggAllRw, wargaAktif, salesAgg] = await Promise.all([
      KelurahanDashboardRepository.totalRw(kelurahanId),
      KelurahanDashboardRepository.todayAggregatesAllRw(kelurahanId),
      KelurahanDashboardRepository.totalActiveWarga(kelurahanId),
      KelurahanDashboardRepository.totalSalesAllRw(kelurahanId),
    ]);
    return {
      total_rw: rwCount,
      total_transactions_today_all_rw: todayAggAllRw.total_transactions,
      total_weight_today_all_rw: todayAggAllRw.total_weight,
      total_penjualan_all_rw: salesAgg.total_amount,
      total_warga_aktif_kelurahan: wargaAktif,
    };
  },

  async rwPerformance(kelurahanId) {
    return KelurahanDashboardRepository.rwPerformance(kelurahanId);
  },

  async weightMonthly(kelurahanId, months) {
    return KelurahanDashboardRepository.weightMonthly(kelurahanId, months);
  },

  async recentTransactions(kelurahanId, limit) {
    return KelurahanDashboardRepository.recentTransactions(kelurahanId, limit);
  },

  async recentSales(kelurahanId, limit) {
    return KelurahanDashboardRepository.recentSales(kelurahanId, limit);
  },

  async rwRanking(kelurahanId) {
    return KelurahanDashboardRepository.rwRanking(kelurahanId);
  },

  async wasteComposition(kelurahanId) {
    return KelurahanDashboardRepository.wasteComposition(kelurahanId);
  },

  async alerts(kelurahanId, userId) {
    const [rwNoActivity, rtAnomalies, unreadNotifications] = await Promise.all([
      KelurahanDashboardRepository.rwNoActivityThisMonth(kelurahanId),
      KelurahanDashboardRepository.rtAnomalies(kelurahanId),
      KelurahanDashboardRepository.unreadNotifications(userId, kelurahanId),
    ]);
    return {
      rw_no_activity_this_month: rwNoActivity,
      rt_anomalies: rtAnomalies,
      unread_notifications: unreadNotifications,
    };
  },
};
