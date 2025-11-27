import { UsersRepo } from "../repositories/users.repo.js";
import { WalletsRepo } from "../repositories/wallets.repo.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { signJwt } from "../utils/jwt.js";
import { AppError } from "../utils/errors.js";

export const AuthService = {
  async registerWarga(payload) {
    const { name, email, phone, alamat, password, rt, rw } = payload;
    if (!email && !phone) throw new AppError(400, "Email or phone is required");

    const passwordHash = await hashPassword(password);
    const user = await UsersRepo.create({
      name,
      email: email || null,
      phone: phone || null,
      alamat: alamat || null,
      password: passwordHash,
      role: "warga",
      rt: rt ?? null,
      rw,
      kelurahan_id: 1,
    });

    await WalletsRepo.create({ user_id: user.user_id, balance: "0.00" });

    const token = signJwt({ sub: user.user_id, role: user.role });
    return { user: sanitize(user), token };
  },

  async registerRw(payload) {
    const { name, email, phone, alamat, password, rw_id } = payload;
    const passwordHash = await hashPassword(password);
    const user = await UsersRepo.create({
      name,
      email,
      phone: phone || null,
      alamat: alamat || null,
      password: passwordHash,
      role: "rw",
      rw: rw_id,
      kelurahan_id: 1,
    });
    await WalletsRepo.create({ user_id: user.user_id, balance: "0.00" });
    const token = signJwt({ sub: user.user_id, role: user.role });
    return { user: sanitize(user), token };
  },

  async login({ emailOrPhone, password }) {
    let user = null;
    if (emailOrPhone.includes("@")) {
      user = await UsersRepo.findByEmail(emailOrPhone);
    } else {
      user = await UsersRepo.findByPhone(emailOrPhone);
    }
    if (!user) throw new AppError(401, "Invalid credentials");
    const ok = await comparePassword(password, user.password);
    if (!ok) throw new AppError(401, "Invalid credentials");
    const token = signJwt({ sub: user.user_id, role: user.role });
    return { user: sanitize(user), token };
  },

  async profile(user_id) {
    const user = await UsersRepo.findById(user_id);
    if (!user) throw new AppError(404, "User not found");
    return sanitize(user);
  },

  async updateProfile(user_id, payload) {
    const existing = await UsersRepo.findById(user_id);
    if (!existing) throw new AppError(404, "User not found");

    const { name, email, phone, alamat, rt, rw } = payload;

    // Optional uniqueness checks when changing email/phone
    if (email && email !== existing.email) {
      const dup = await UsersRepo.findByEmail(email);
      if (dup) throw new AppError(409, "Email already in use");
    }
    if (phone && phone !== existing.phone) {
      const dup2 = await UsersRepo.findByPhone(phone);
      if (dup2) throw new AppError(409, "Phone already in use");
    }

    const updated = await UsersRepo.updateById(user_id, {
      name: name ?? existing.name,
      email: email ?? existing.email,
      phone: phone ?? existing.phone,
      alamat: alamat ?? existing.alamat,
      rt: rt ?? existing.rt,
      rw: rw ?? existing.rw,
    });
    return sanitize(updated);
  },
};

function sanitize(user) {
  const { password, ...rest } = user;
  return rest;
}
