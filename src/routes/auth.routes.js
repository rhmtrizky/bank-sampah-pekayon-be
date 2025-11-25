import express from "express";
import {
  register,
  registerRw,
  login,
  profile,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register); // warga
router.post("/register-rw", registerRw); // kelurahan triggers creation of RW user
router.post("/login", login);
router.get("/profile", authRequired, profile);

export default router;
