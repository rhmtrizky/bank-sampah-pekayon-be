import express from "express";
import authRoutes from "./auth.routes.js";
import walletRoutes from "./wallet.routes.js";
import transactionsRoutes from "./transactions.routes.js";
import depositRequestRoutes from "./depositRequest.routes.js";
import wasteTypesRoutes from "./wasteTypes.routes.js";
import priceListRoutes from "./priceList.routes.js";
import schedulesRoutes from "./schedules.routes.js";
import bulkSalesRoutes from "./bulkSales.routes.js";
import reportsRoutes from "./reports.routes.js";
import monitoringRoutes from "./monitoring.routes.js";
import adminRoutes from "./admin.routes.js";
import rwRoutes from "./rw.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = express.Router();

router.get("/", (req, res) => {
  const port = process.env.PORT || 5000;
  res.json({ status: "ok", message: `Server running on port ${port}` });
});

router.use("/auth", authRoutes);
router.use("/wallet", walletRoutes);
router.use("/transactions", transactionsRoutes);
router.use("/deposit-request", depositRequestRoutes);
router.use("/waste-types", wasteTypesRoutes);
router.use("/price-list", priceListRoutes);
router.use("/schedule", schedulesRoutes);
router.use("/bulk-sales", bulkSalesRoutes);
router.use("/reports", reportsRoutes);
router.use("/monitoring", monitoringRoutes);
router.use("/admin", adminRoutes);
router.use("/rw", rwRoutes);
router.use("/upload", uploadRoutes);

export default router;
