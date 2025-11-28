import { asyncHandler } from "../utils/errors.js";
import { ok, created } from "../utils/response.js";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = asyncHandler(async (req, res) => {
  try {
    const file = req.file || req.files?.file || req.files?.photo;
    if (!file) {
      return ok(res, { url: null }, "No file provided");
    }
    const upload = await cloudinary.uploader.upload(file.path, {
      folder: "bank-sampah/uploads",
      resource_type: "image",
    });
    return created(res, { url: upload.secure_url }, "Image uploaded");
  } catch (err) {
    const msg = err?.message || "Upload failed";
    return res.status(500).json({ status: "error", message: msg });
  }
});
