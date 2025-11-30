import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  listMyDepositRequests,
  scheduleDepositRequest,
  completeDepositRequest,
  createDepositRequest,
  getDepositRequestDetail,
  cancelDepositRequest,
  bulkScheduleDepositRequests,
} from "../controllers/depositRequests.controller.js";

const router = express.Router();

router.post("/", authRequired, requireRole(["warga"]), createDepositRequest);
router.get(
  "/mine",
  authRequired,
  requireRole(["warga"]),
  listMyDepositRequests
);
router.get(
  "/:id",
  authRequired,
  requireRole(["warga", "rw", "kelurahan", "super_admin"]),
  getDepositRequestDetail
);
router.patch(
  "/:id/schedule",
  authRequired,
  requireRole(["rw"]),
  scheduleDepositRequest
);
router.patch(
  "/bulk-schedule",
  authRequired,
  requireRole(["rw"]),
  bulkScheduleDepositRequests
);
router.patch(
  "/:id/complete",
  authRequired,
  requireRole(["rw"]),
  completeDepositRequest
);
router.patch(
  "/:id/cancel",
  authRequired,
  requireRole(["warga"]),
  cancelDepositRequest
);

export default router;
