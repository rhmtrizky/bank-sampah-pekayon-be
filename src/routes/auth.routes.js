import express from "express";
import {
  register,
  registerRw,
  login,
  profile,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register); // warga
// router.post("/register-rw", registerRw); // disabled: RW accounts created by super_admin
router.post("/login", login);
router.get("/profile", authRequired, profile);
router.put("/profile", authRequired, updateProfile);

export default router;
