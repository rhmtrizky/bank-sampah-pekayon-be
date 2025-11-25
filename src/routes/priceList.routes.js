import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  createPriceListRw,
  createPriceListKelurahan,
  listPriceList,
} from "../controllers/priceList.controller.js";

const router = express.Router();

router.get("/", authRequired, listPriceList);
router.post("/", authRequired, requireRole(["rw"]), createPriceListRw);
router.post(
  "/kelurahan",
  authRequired,
  requireRole(["kelurahan"]),
  createPriceListKelurahan
);

export default router;
