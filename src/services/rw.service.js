import { UsersRepo } from "../repositories/users.repo.js";
import { WalletsRepo } from "../repositories/wallets.repo.js";
import { hashPassword } from "../utils/password.js";
import { AppError } from "../utils/errors.js";

function sanitize(user) {
  const { password, ...rest } = user;
  return rest;
}

export const RwService = {
  async createWarga(rwUser, payload) {
    const { name, email, phone, alamat, password, rt } = payload;

    // Check duplicates
    if (email) {
      const existingEmail = await UsersRepo.findByEmail(email);
      if (existingEmail) throw new AppError(409, "Email already in use");
    }
    if (phone) {
      const existingPhone = await UsersRepo.findByPhone(phone);
      if (existingPhone) throw new AppError(409, "Phone already in use");
    }

    const passwordHash = await hashPassword(password);

    // Create user with role 'warga', assigned to RW's rw_id
    const user = await UsersRepo.create({
      name,
      email: email || null,
      phone: phone,
      alamat: alamat || null,
      password: passwordHash,
      role: "warga",
      rt: rt ?? null,
      rw: rwUser.rw, // Enforce RW's rw_id
      kelurahan_id: rwUser.kelurahan_id || 1, // Default or from RW
    });

    // Initialize wallet
    await WalletsRepo.create({ user_id: user.user_id, balance: "0.00" });

    return sanitize(user);
  },

  async listWarga(rwUser, { page = 1, limit = 20, name, phone } = {}) {
    if (rwUser.role !== "rw") throw new AppError(403, "Only RW can list warga");
    return UsersRepo.listByRwPaginated(rwUser.rw, { page, limit, name, phone });
  },
};
