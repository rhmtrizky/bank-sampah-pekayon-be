import { Router } from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  listRwPublic,
  getRwById,
  createWargaByRw,
  listWargaByRw,
} from "../controllers/rw.controller.js";

const router = Router();

// All authenticated roles can access RW list
router.get("/", listRwPublic);

// RW can manage warga creation and listing
router.post("/warga", authRequired, requireRole(["rw"]), createWargaByRw);
router.get("/warga", authRequired, requireRole(["rw"]), listWargaByRw);

// Dynamic route must come after static routes to avoid collisions
router.get("/:id", getRwById);

export default router;
