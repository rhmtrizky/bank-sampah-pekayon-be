export class AppError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details || undefined;
  }
}

export const isPrismaNotFound = (e) =>
  Boolean(e?.name === "NotFoundError" || e?.code === "P2025");

export const mapPrismaError = (e) => {
  const code = e?.code;
  switch (code) {
    case "P2002":
      return new AppError(409, "Unique constraint failed", e?.meta);
    case "P2003":
      return new AppError(400, "Foreign key constraint failed", e?.meta);
    case "P2025":
      return new AppError(404, "Record not found", e?.meta);
    default:
      return new AppError(500, "Database error", { code, meta: e?.meta });
  }
};

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
