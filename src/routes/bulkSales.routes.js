import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  createPengepul,
  listPengepul,
  createBulkSale,
  listBulkSales,
} from "../controllers/bulkSales.controller.js";

const router = express.Router();

// Pengepul
router.post(
  "/pengepul",
  authRequired,
  requireRole(["rw", "kelurahan"]),
  createPengepul
);
router.get("/pengepul", authRequired, listPengepul);

// Bulk sales
router.post(
  "/",
  authRequired,
  requireRole(["rw", "kelurahan"]),
  createBulkSale
);
router.get("/", authRequired, listBulkSales);

export default router;
