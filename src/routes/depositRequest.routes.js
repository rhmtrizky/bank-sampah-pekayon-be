import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  createDepositRequest,
  listMyDepositRequests,
  scheduleDepositRequest,
  completeDepositRequest,
} from "../controllers/depositRequests.controller.js";

const router = express.Router();

router.post("/", authRequired, requireRole(["warga"]), createDepositRequest);
router.get(
  "/mine",
  authRequired,
  requireRole(["warga"]),
  listMyDepositRequests
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
