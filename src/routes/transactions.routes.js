import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  createOffline,
  listTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactions.controller.js";

const router = express.Router();

router.post("/offline", authRequired, requireRole(["rw"]), createOffline);
router.get("/", authRequired, requireRole(["rw"]), listTransactions);
router.get("/:id", authRequired, requireRole(["rw"]), getTransactionById);
router.patch("/:id", authRequired, requireRole(["rw"]), updateTransaction);
router.delete("/:id", authRequired, requireRole(["rw"]), deleteTransaction);

export default router;
