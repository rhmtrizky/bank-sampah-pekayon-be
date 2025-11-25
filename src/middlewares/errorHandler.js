import { ZodError } from "zod";
import { AppError, mapPrismaError } from "../utils/errors.js";

export function notFoundHandler(req, res, _next) {
  res.status(404).json({ status: "error", message: "Route not found" });
}

export function errorHandler(err, _req, res, _next) {
  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: err.errors.map((e) => ({ path: e.path, message: e.message })),
    });
  }

  // Prisma error shape
  if (err?.code?.startsWith?.("P")) {
    const mapped = mapPrismaError(err);
    return res
      .status(mapped.statusCode)
      .json({
        status: "error",
        message: mapped.message,
        details: mapped.details,
      });
  }

  // AppError
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: "error", message: err.message, details: err.details });
  }

  // Fallback
  console.error("Unhandled error:", err);
  return res
    .status(500)
    .json({ status: "error", message: "Internal server error" });
}
