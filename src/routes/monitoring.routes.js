import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  monitoringRw,
  monitoringRt,
} from "../controllers/monitoring.controller.js";

const router = express.Router();

router.get("/rw", authRequired, requireRole(["kelurahan", "rw"]), monitoringRw); // kelurahan sees all its RW, rw sees itself
router.get("/rt", authRequired, requireRole(["kelurahan", "rw"]), monitoringRt);

export default router;
