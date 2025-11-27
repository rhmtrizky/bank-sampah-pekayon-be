import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  listMyDepositRequests,
  scheduleDepositRequest,
  completeDepositRequest,
  createDepositRequest,
  getDepositRequestDetail,
} from "../controllers/depositRequests.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "uploads/" });
router.post(
  "/",
  authRequired,
  requireRole(["warga"]),
  upload.single("photo"),
  createDepositRequest
);
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
  "/:id/complete",
  authRequired,
  requireRole(["rw"]),
  completeDepositRequest
);

export default router;
