import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  createCollectionSchedule,
  createWithdrawSchedule,
  listCollectionSchedules,
  listWithdrawSchedules,
  updateCollectionSchedule,
  deleteCollectionSchedule,
  updateWithdrawSchedule,
  deleteWithdrawSchedule,
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
router.put(
  "/collection/:id",
  authRequired,
  requireRole(["rw", "kelurahan"]),
  updateCollectionSchedule
);
router.delete(
  "/collection/:id",
  authRequired,
  requireRole(["rw", "kelurahan"]),
  deleteCollectionSchedule
);
router.post(
  "/withdraw",
  authRequired,
  requireRole(["rw", "kelurahan"]),
  createWithdrawSchedule
);
router.put(
  "/withdraw/:id",
  authRequired,
  requireRole(["rw", "kelurahan"]),
  updateWithdrawSchedule
);
router.delete(
  "/withdraw/:id",
  authRequired,
  requireRole(["rw", "kelurahan"]),
  deleteWithdrawSchedule
);

export default router;
