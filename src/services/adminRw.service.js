import { RwRepo } from "../repositories/rw.repo.js";
import { KelurahanRepo } from "../repositories/kelurahan.repo.js";
import { UsersRepo } from "../repositories/users.repo.js";
import { hashPassword } from "../utils/password.js";
import { AppError } from "../utils/errors.js";

export const AdminRwService = {
  async create(user, payload) {
    if (user.role !== "super_admin") throw new AppError(403, "Forbidden");
    const kel = await KelurahanRepo.findById(payload.kelurahan_id);
    if (!kel) throw new AppError(400, "Kelurahan not found");
    // nomor_rw uniqueness enforced by DB (composite unique)
    const rwRow = await RwRepo.create({
      kelurahan_id: payload.kelurahan_id,
      nomor_rw: payload.nomor_rw,
      name: payload.name || null,
      phone: payload.phone || null,
      address: payload.address || null,
    });
    // create associated user account for RW login
    const passwordHash = await hashPassword(payload.password);
    const newUser = await UsersRepo.create({
      name: payload.name || `RW ${payload.nomor_rw}`,
      email: null,
      phone: payload.phone || null,
      alamat: payload.address || null,
      password: passwordHash,
      role: "rw",
      rw: rwRow.rw_id,
      kelurahan_id: payload.kelurahan_id,
    });
    return { rw: rwRow, user: newUser };
  },
  async list(user, kelurahan_id) {
    if (user.role !== "super_admin") throw new AppError(403, "Forbidden");
    return RwRepo.list(kelurahan_id ? Number(kelurahan_id) : undefined);
  },
  async update(user, rw_id, payload) {
    if (user.role !== "super_admin") throw new AppError(403, "Forbidden");
    const existing = await RwRepo.findById(rw_id);
    if (!existing) throw new AppError(404, "RW not found");
    return RwRepo.update(rw_id, payload);
  },
};
