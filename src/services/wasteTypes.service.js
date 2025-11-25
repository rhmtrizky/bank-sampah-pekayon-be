import { WasteTypesRepo } from "../repositories/wasteTypes.repo.js";
import { AppError } from "../utils/errors.js";

export const WasteTypesService = {
  async create(user, payload) {
    if (user.role !== "rw")
      throw new AppError(403, "Only RW can create waste types");
    return WasteTypesRepo.create({
      name: payload.name,
      description: payload.description || null,
    });
  },
  async list() {
    return WasteTypesRepo.list();
  },
  async update(user, id, payload) {
    if (user.role !== "rw")
      throw new AppError(403, "Only RW can update waste types");
    const existing = await WasteTypesRepo.findById(id);
    if (!existing) throw new AppError(404, "Waste type not found");
    return WasteTypesRepo.update(id, payload);
  },
  async remove(user, id) {
    if (user.role !== "rw")
      throw new AppError(403, "Only RW can delete waste types");
    const existing = await WasteTypesRepo.findById(id);
    if (!existing) throw new AppError(404, "Waste type not found");
    // Attempt delete; if FK constraint fails, Prisma error handler will map it.
    return WasteTypesRepo.delete(id);
  },
};
