import { asyncHandler } from "../utils/errors.js";
import { ok, created } from "../utils/response.js";
import cloudinary from "../config/cloudinary.js";

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return ok(res, { url: null }, "No file provided");
  }
  const upload = await cloudinary.uploader.upload(req.file.path, {
    folder: "bank-sampah/uploads",
    resource_type: "image",
  });
  return created(res, { url: upload.secure_url }, "Image uploaded");
});
