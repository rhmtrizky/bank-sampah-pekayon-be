import { verifyJwt } from "../utils/jwt.js";
import prisma from "../config/database.js";
import { AppError } from "../utils/errors.js";

export async function authRequired(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.substring(7) : null;
    if (!token) throw new AppError(401, "Authorization token missing");

    const payload = verifyJwt(token);
    const user = await prisma.users.findUnique({
      where: { user_id: payload.sub },
    });
    if (!user) throw new AppError(401, "Invalid token");

    req.user = user;
    next();
  } catch (e) {
    next(new AppError(401, "Unauthorized"));
  }
}

export function requireRole(roles = []) {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError(401, "Unauthorized"));
    if (!roles.includes(req.user.role))
      return next(new AppError(403, "Forbidden"));
    next();
  };
}

export function allow(roles = []) {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError(401, "Unauthorized"));
    if (!roles.includes(req.user.role))
      return next(new AppError(403, "Forbidden"));
    next();
  };
}
