import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  createPriceListRw,
  createPriceListKelurahan,
  listPriceList,
  listPriceListByRw,
  updatePriceListRw,
  deletePriceListRw,
  updatePriceListKelurahan,
  deletePriceListKelurahan,
  listPriceListByRwPaginated,
  listPriceListByKelurahanPaginated,
} from "../controllers/priceList.controller.js";

const router = express.Router();

router.get("/", authRequired, listPriceList);
router.get("/rw/:rw_id", authRequired, listPriceListByRw);
router.get(
  "/rw/:rw_id/paginated",
  authRequired,
  requireRole(["rw"]),
  listPriceListByRwPaginated
);
router.get(
  "/kelurahan/:kelurahan_id/paginated",
  authRequired,
  requireRole(["kelurahan"]),
  listPriceListByKelurahanPaginated
);
router.post("/rw", authRequired, requireRole(["rw"]), createPriceListRw);
router.patch(
  "/rw/:price_id",
  authRequired,
  requireRole(["rw"]),
  updatePriceListRw
);
router.delete(
  "/rw/:price_id",
  authRequired,
  requireRole(["rw"]),
  deletePriceListRw
);
router.post(
  "/kelurahan",
  authRequired,
  requireRole(["kelurahan"]),
  createPriceListKelurahan
);
router.patch(
  "/kelurahan/:price_id",
  authRequired,
  requireRole(["kelurahan"]),
  updatePriceListKelurahan
);
router.delete(
  "/kelurahan/:price_id",
  authRequired,
  requireRole(["kelurahan"]),
  deletePriceListKelurahan
);

export default router;
