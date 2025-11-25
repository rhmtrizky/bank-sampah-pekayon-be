import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  createKelurahan,
  listKelurahan,
  updateKelurahan,
  createRw,
  listRw,
  updateRw,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All endpoints restricted to super_admin
router.use(authRequired, requireRole(["super_admin"]));

// Kelurahan
router.post("/kelurahan", createKelurahan);
router.get("/kelurahan", listKelurahan);
router.patch("/kelurahan/:id", updateKelurahan);

// RW
router.post("/rw", createRw);
router.get("/rw", listRw);
router.patch("/rw/:id", updateRw);

export default router;
