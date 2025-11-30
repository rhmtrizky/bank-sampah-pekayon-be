import { asyncHandler } from "../../utils/errors.js";
import { ok } from "../../utils/response.js";
import { KelurahanDashboardService } from "../../services/dashboard/kelurahan.dashboard.service.js";

export const getKelurahanSummary = asyncHandler(async (req, res) => {
  const kelurahanId = req.user.kelurahan_id;
  const data = await KelurahanDashboardService.summary(kelurahanId);
  return ok(res, data, "Kelurahan summary");
});

export const getKelurahanRwPerformance = asyncHandler(async (req, res) => {
  const kelurahanId = req.user.kelurahan_id;
  const data = await KelurahanDashboardService.rwPerformance(kelurahanId);
  return ok(res, data, "Kelurahan RW performance");
});

export const getKelurahanWeightMonthly = asyncHandler(async (req, res) => {
  const kelurahanId = req.user.kelurahan_id;
  const data = await KelurahanDashboardService.weightMonthly(kelurahanId, 12);
  return ok(res, data, "Kelurahan weight monthly");
});

export const getKelurahanRecentTransactions = asyncHandler(async (req, res) => {
  const kelurahanId = req.user.kelurahan_id;
  const data = await KelurahanDashboardService.recentTransactions(
    kelurahanId,
    20
  );
  return ok(res, data, "Kelurahan recent transactions");
});

export const getKelurahanRecentSales = asyncHandler(async (req, res) => {
  const kelurahanId = req.user.kelurahan_id;
  const data = await KelurahanDashboardService.recentSales(kelurahanId, 20);
  return ok(res, data, "Kelurahan recent sales");
});

export const getKelurahanRwRanking = asyncHandler(async (req, res) => {
  const kelurahanId = req.user.kelurahan_id;
  const data = await KelurahanDashboardService.rwRanking(kelurahanId);
  return ok(res, data, "Kelurahan RW ranking");
});

export const getKelurahanWasteComposition = asyncHandler(async (req, res) => {
  const kelurahanId = req.user.kelurahan_id;
  const data = await KelurahanDashboardService.wasteComposition(kelurahanId);
  return ok(res, data, "Kelurahan waste composition");
});

export const getKelurahanAlerts = asyncHandler(async (req, res) => {
  const kelurahanId = req.user.kelurahan_id;
  const userId = req.user.user_id;
  const data = await KelurahanDashboardService.alerts(kelurahanId, userId);
  return ok(res, data, "Kelurahan alerts");
});
