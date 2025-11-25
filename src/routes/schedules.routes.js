import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  createCollectionSchedule,
  createWithdrawSchedule,
  listCollectionSchedules,
  listWithdrawSchedules,
} from "../controllers/schedules.controller.js";

const router = express.Router();

router.get("/collection", authRequired, listCollectionSchedules);
router.get("/withdraw", authRequired, listWithdrawSchedules);
router.post(
  "/collection",
  authRequired,
  requireRole(["rw", "kelurahan"]),
  createCollectionSchedule
);
router.post(
  "/withdraw",
  authRequired,
  requireRole(["rw", "kelurahan"]),
  createWithdrawSchedule
);

export default router;
