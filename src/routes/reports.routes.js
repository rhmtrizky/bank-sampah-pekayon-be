import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  getRwReport,
  getKelurahanReport,
} from "../controllers/reports.controller.js";

const router = express.Router();

router.get("/rw", authRequired, requireRole(["rw", "kelurahan"]), getRwReport);
router.get(
  "/kelurahan",
  authRequired,
  requireRole(["kelurahan"]),
  getKelurahanReport
);

export default router;
