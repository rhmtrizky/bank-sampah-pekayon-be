import {
  registerSchema,
  registerRwSchema,
  loginSchema,
  updateProfileSchema,
} from "../validations/auth.validation.js";
import { AuthService } from "../services/auth.service.js";
import { asyncHandler } from "../utils/errors.js";
import { ok, created } from "../utils/response.js";

export const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.parse(req.body);
  const result = await AuthService.registerWarga(parsed);
  return created(res, result, "Registered warga");
});

export const registerRw = asyncHandler(async (req, res) => {
  const parsed = registerRwSchema.parse(req.body);
  // RW registration removed: RW accounts are created by super_admin via admin RW creation
  return ok(res, null, "RW registration is disabled");
});

export const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.parse(req.body);
  const result = await AuthService.login(parsed);
  return ok(res, result, "Logged in");
});

export const profile = asyncHandler(async (req, res) => {
  const result = await AuthService.profile(req.user.user_id);
  return ok(res, result, "Profile");
});

export const updateProfile = asyncHandler(async (req, res) => {
  const parsed = updateProfileSchema.parse(req.body);
  const result = await AuthService.updateProfile(req.user.user_id, parsed);
  return ok(res, result, "Profile updated");
});
