import { KelurahanRepo } from "../repositories/kelurahan.repo.js";
import { AppError } from "../utils/errors.js";

export const AdminKelurahanService = {
  async create(user, payload) {
    if (user.role !== "super_admin") throw new AppError(403, "Forbidden");
    return KelurahanRepo.create(payload);
  },
  async list(user) {
    if (user.role !== "super_admin") throw new AppError(403, "Forbidden");
    return KelurahanRepo.list();
  },
  async update(user, id, payload) {
    if (user.role !== "super_admin") throw new AppError(403, "Forbidden");
    const existing = await KelurahanRepo.findById(id);
    if (!existing) throw new AppError(404, "Kelurahan not found");
    return KelurahanRepo.update(id, payload);
  },
};
