import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  createPriceListRw,
  createPriceListKelurahan,
  listPriceList,
  listPriceListByRw,
} from "../controllers/priceList.controller.js";

const router = express.Router();

router.get("/", authRequired, listPriceList);
router.get("/rw/:rw_id", authRequired, listPriceListByRw);
router.post("/", authRequired, requireRole(["rw"]), createPriceListRw);
router.post(
  "/kelurahan",
  authRequired,
  requireRole(["kelurahan"]),
  createPriceListKelurahan
);

export default router;
