import express from "express";
import multer from "multer";
import { authRequired } from "../middlewares/auth.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /upload/image -> returns { url }
router.post("/image", authRequired, upload.single("file"), uploadImage);

export default router;
