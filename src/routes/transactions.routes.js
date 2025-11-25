import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import { createOffline } from "../controllers/transactions.controller.js";

const router = express.Router();

router.post("/offline", authRequired, requireRole(["rw"]), createOffline);

export default router;
