import { Router } from "express";
import { listRwPublic, getRwById } from "../controllers/rw.controller.js";

const router = Router();

// All authenticated roles can access RW list
router.get("/", listRwPublic);

router.get("/:id", getRwById);

export default router;
