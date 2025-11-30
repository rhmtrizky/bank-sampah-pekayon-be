import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  getRwSummary,
  getRwTransactionsDaily,
  getRwWeightDaily,
  getRwWasteComposition,
  getRwRecentTransactions,
  getRwRecentRequests,
  getRwRtStatistics,
  getRwSalesSummary,
  getRwRecentSales,
  getRwAlerts,
  getRwSchedules,
} from "../controllers/dashboard/rw.dashboard.controller.js";
import {
  getKelurahanSummary,
  getKelurahanRwPerformance,
  getKelurahanWeightMonthly,
  getKelurahanRecentTransactions,
  getKelurahanRecentSales,
  getKelurahanRwRanking,
  getKelurahanWasteComposition,
  getKelurahanAlerts,
} from "../controllers/dashboard/kelurahan.dashboard.controller.js";

const router = express.Router();

// RW dashboard endpoints
router.use("/rw", authRequired, requireRole(["rw"]));
router.get("/rw/summary", getRwSummary);
router.get("/rw/charts/transactions-daily", getRwTransactionsDaily);
router.get("/rw/charts/weight-daily", getRwWeightDaily);
router.get("/rw/charts/waste-composition", getRwWasteComposition);
router.get("/rw/recent/transactions", getRwRecentTransactions);
router.get("/rw/recent/requests", getRwRecentRequests);
router.get("/rw/rt-statistics", getRwRtStatistics);
router.get("/rw/sales-summary", getRwSalesSummary);
router.get("/rw/recent-sales", getRwRecentSales);
router.get("/rw/alerts", getRwAlerts);
router.get("/rw/schedules", getRwSchedules);

// Kelurahan dashboard endpoints
router.use("/kelurahan", authRequired, requireRole(["kelurahan"]));
router.get("/kelurahan/summary", getKelurahanSummary);
router.get("/kelurahan/charts/rw-performance", getKelurahanRwPerformance);
router.get("/kelurahan/charts/weight-monthly", getKelurahanWeightMonthly);
router.get("/kelurahan/recent/transactions", getKelurahanRecentTransactions);
router.get("/kelurahan/recent-sales", getKelurahanRecentSales);
router.get("/kelurahan/rw-ranking", getKelurahanRwRanking);
router.get("/kelurahan/waste-composition", getKelurahanWasteComposition);
router.get("/kelurahan/alerts", getKelurahanAlerts);

export default router;
