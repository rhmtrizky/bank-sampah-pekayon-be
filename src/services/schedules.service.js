import { AppError } from "../utils/errors.js";
import {
  CollectionSchedulesRepo,
  WithdrawSchedulesRepo,
} from "../repositories/schedules.repo.js";

export const SchedulesService = {
  async createCollection(user, payload) {
    if (!["rw", "kelurahan"].includes(user.role))
      throw new AppError(403, "Forbidden");
    const base = {
      title: payload.title,
      date: new Date(payload.date),
      start_time: new Date(payload.start_time),
      end_time: new Date(payload.end_time),
      description: payload.description || null,
    };
    let data;
    if (user.role === "rw") {
      data = await CollectionSchedulesRepo.create({
        ...base,
        rw_id: user.rw,
        kelurahan_id: user.kelurahan_id,
      });
    } else {
      if (!user.kelurahan_id)
        throw new AppError(400, "Kelurahan context missing");
      data = await CollectionSchedulesRepo.create({
        ...base,
        kelurahan_id: user.kelurahan_id,
        rw_id: null,
      });
    }
    return data;
  },

  async createWithdraw(user, payload) {
    if (!["rw", "kelurahan"].includes(user.role))
      throw new AppError(403, "Forbidden");
    const base = {
      title: payload.title,
      date: new Date(payload.date),
      start_time: new Date(payload.start_time),
      end_time: new Date(payload.end_time),
      description: payload.description || null,
    };
    let data;
    if (user.role === "rw") {
      data = await WithdrawSchedulesRepo.create({
        ...base,
        rw_id: user.rw,
        kelurahan_id: user.kelurahan_id,
      });
    } else {
      if (!user.kelurahan_id)
        throw new AppError(400, "Kelurahan context missing");
      data = await WithdrawSchedulesRepo.create({
        ...base,
        kelurahan_id: user.kelurahan_id,
        rw_id: null,
      });
    }
    return data;
  },

  async listCollection(query) {
    const { rw_id, kelurahan_id } = query;
    const page = query.page ? Number.parseInt(query.page, 10) : 1;
    const limit = query.limit ? Number.parseInt(query.limit, 10) : 10;
    return CollectionSchedulesRepo.list({
      rw_id: rw_id ? Number(rw_id) : undefined,
      kelurahan_id: kelurahan_id ? Number(kelurahan_id) : undefined,
      page,
      limit,
    });
  },

  async listWithdraw(query) {
    const { rw_id, kelurahan_id } = query;
    const page = query.page ? Number.parseInt(query.page, 10) : 1;
    const limit = query.limit ? Number.parseInt(query.limit, 10) : 10;
    return WithdrawSchedulesRepo.list({
      rw_id: rw_id ? Number(rw_id) : undefined,
      kelurahan_id: kelurahan_id ? Number(kelurahan_id) : undefined,
      page,
      limit,
    });
  },
  async updateCollection(user, id, payload) {
    if (!["rw", "kelurahan"].includes(user.role))
      throw new AppError(403, "Forbidden");
    const existing = await CollectionSchedulesRepo.findById(id);
    if (!existing) throw new AppError(404, "Schedule not found");
    if (user.role === "rw") {
      if (existing.rw_id !== user.rw)
        throw new AppError(403, "Cannot modify schedule of another RW");
    } else {
      if (existing.kelurahan_id !== user.kelurahan_id)
        throw new AppError(403, "Cannot modify schedule of another Kelurahan");
    }
    const data = {
      title: payload.title,
      date: new Date(payload.date),
      start_time: new Date(payload.start_time),
      end_time: new Date(payload.end_time),
      description: payload.description || null,
    };
    return CollectionSchedulesRepo.update(id, data);
  },
  async deleteCollection(user, id) {
    if (!["rw", "kelurahan"].includes(user.role))
      throw new AppError(403, "Forbidden");
    const existing = await CollectionSchedulesRepo.findById(id);
    if (!existing) throw new AppError(404, "Schedule not found");
    if (user.role === "rw") {
      if (existing.rw_id !== user.rw)
        throw new AppError(403, "Cannot delete schedule of another RW");
    } else {
      if (existing.kelurahan_id !== user.kelurahan_id)
        throw new AppError(403, "Cannot delete schedule of another Kelurahan");
    }
    await CollectionSchedulesRepo.delete(id);
    return { deleted: true };
  },
  async updateWithdraw(user, id, payload) {
    if (!["rw", "kelurahan"].includes(user.role))
      throw new AppError(403, "Forbidden");
    const existing = await WithdrawSchedulesRepo.findById(id);
    if (!existing) throw new AppError(404, "Schedule not found");
    if (user.role === "rw") {
      if (existing.rw_id !== user.rw)
        throw new AppError(403, "Cannot modify schedule of another RW");
    } else {
      if (existing.kelurahan_id !== user.kelurahan_id)
        throw new AppError(403, "Cannot modify schedule of another Kelurahan");
    }
    const data = {
      title: payload.title,
      date: new Date(payload.date),
      start_time: new Date(payload.start_time),
      end_time: new Date(payload.end_time),
      description: payload.description || null,
    };
    return WithdrawSchedulesRepo.update(id, data);
  },
  async deleteWithdraw(user, id) {
    if (!["rw", "kelurahan"].includes(user.role))
      throw new AppError(403, "Forbidden");
    const existing = await WithdrawSchedulesRepo.findById(id);
    if (!existing) throw new AppError(404, "Schedule not found");
    if (user.role === "rw") {
      if (existing.rw_id !== user.rw)
        throw new AppError(403, "Cannot delete schedule of another RW");
    } else {
      if (existing.kelurahan_id !== user.kelurahan_id)
        throw new AppError(403, "Cannot delete schedule of another Kelurahan");
    }
    await WithdrawSchedulesRepo.delete(id);
    return { deleted: true };
  },
};
