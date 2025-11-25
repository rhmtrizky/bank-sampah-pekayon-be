import express from "express";
import { authRequired, requireRole } from "../middlewares/auth.js";
import {
  createWasteType,
  listWasteTypes,
  updateWasteType,
  deleteWasteType,
} from "../controllers/wasteTypes.controller.js";

const router = express.Router();

router.get("/", authRequired, listWasteTypes); // could allow public if desired
router.post("/", authRequired, requireRole(["rw"]), createWasteType);
router.patch("/:id", authRequired, requireRole(["rw"]), updateWasteType);
router.delete("/:id", authRequired, requireRole(["rw"]), deleteWasteType);

export default router;
