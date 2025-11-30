import { asyncHandler } from "../../utils/errors.js";
import { ok } from "../../utils/response.js";
import { RwDashboardService } from "../../services/dashboard/rw.dashboard.service.js";

export const getRwSummary = asyncHandler(async (req, res) => {
  const rwId = req.user.rw;
  const data = await RwDashboardService.summary(rwId);
  return ok(res, data, "RW summary");
});

export const getRwTransactionsDaily = asyncHandler(async (req, res) => {
  const rwId = req.user.rw;
  const data = await RwDashboardService.transactionsDaily(rwId, 30);
  return ok(res, data, "RW transactions daily");
});

export const getRwWeightDaily = asyncHandler(async (req, res) => {
  const rwId = req.user.rw;
  const data = await RwDashboardService.weightDaily(rwId, 30);
  return ok(res, data, "RW weight daily");
});

export const getRwWasteComposition = asyncHandler(async (req, res) => {
  const rwId = req.user.rw;
  const data = await RwDashboardService.wasteComposition(rwId);
  return ok(res, data, "RW waste composition");
});

export const getRwRecentTransactions = asyncHandler(async (req, res) => {
  const rwId = req.user.rw;
  const data = await RwDashboardService.recentTransactions(rwId, 10);
  return ok(res, data, "RW recent transactions");
});

export const getRwRecentRequests = asyncHandler(async (req, res) => {
  const rwId = req.user.rw;
  const page = parseInt(req.query.page || "1", 10);
  const limit = parseInt(req.query.limit || "10", 10);
  const result = await RwDashboardService.recentRequests(rwId, page, limit);
  return ok(res, result, "RW recent requests");
});

export const getRwRtStatistics = asyncHandler(async (req, res) => {
  const rwId = req.user.rw;
  const data = await RwDashboardService.rtStatistics(rwId);
  return ok(res, data, "RW RT statistics");
});

export const getRwSalesSummary = asyncHandler(async (req, res) => {
  const rwId = req.user.rw;
  const data = await RwDashboardService.salesSummary(rwId);
  return ok(res, data, "RW sales summary");
});

export const getRwRecentSales = asyncHandler(async (req, res) => {
  const rwId = req.user.rw;
  const data = await RwDashboardService.recentSales(rwId, 10);
  return ok(res, data, "RW recent sales");
});

export const getRwAlerts = asyncHandler(async (req, res) => {
  const rwId = req.user.rw;
  const userId = req.user.user_id;
  const data = await RwDashboardService.alerts(rwId, userId);
  return ok(res, data, "RW alerts");
});

export const getRwSchedules = asyncHandler(async (req, res) => {
  const rwId = req.user.rw;
  const data = await RwDashboardService.schedules(rwId);
  return ok(res, data, "RW schedules");
});
