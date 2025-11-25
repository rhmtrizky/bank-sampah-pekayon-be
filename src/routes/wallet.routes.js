import express from "express";
import { authRequired } from "../middlewares/auth.js";
import {
  getWallet,
  getWalletHistory,
} from "../controllers/wallet.controller.js";

const router = express.Router();

router.get("/", authRequired, getWallet);
router.get("/history", authRequired, getWalletHistory);

export default router;
