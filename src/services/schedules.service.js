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
        kelurahan_id: null,
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
      date: new Date(payload.date),
      start_time: new Date(payload.start_time),
      end_time: new Date(payload.end_time),
    };
    let data;
    if (user.role === "rw") {
      data = await WithdrawSchedulesRepo.create({
        ...base,
        rw_id: user.rw,
        kelurahan_id: null,
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
    return CollectionSchedulesRepo.list({
      rw_id: rw_id ? Number(rw_id) : undefined,
      kelurahan_id: kelurahan_id ? Number(kelurahan_id) : undefined,
    });
  },

  async listWithdraw(query) {
    const { rw_id, kelurahan_id } = query;
    return WithdrawSchedulesRepo.list({
      rw_id: rw_id ? Number(rw_id) : undefined,
      kelurahan_id: kelurahan_id ? Number(kelurahan_id) : undefined,
    });
  },
};
