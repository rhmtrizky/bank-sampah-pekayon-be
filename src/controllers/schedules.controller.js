import {
  collectionScheduleSchema,
  withdrawScheduleSchema,
} from "../validations/schedules.validation.js";
import { SchedulesService } from "../services/schedules.service.js";
import { asyncHandler } from "../utils/errors.js";
import { created, ok } from "../utils/response.js";

export const createCollectionSchedule = asyncHandler(async (req, res) => {
  const parsed = collectionScheduleSchema.parse(req.body);
  const data = await SchedulesService.createCollection(req.user, parsed);
  return created(res, data, "Collection schedule created");
});

export const createWithdrawSchedule = asyncHandler(async (req, res) => {
  const parsed = withdrawScheduleSchema.parse(req.body);
  const data = await SchedulesService.createWithdraw(req.user, parsed);
  return created(res, data, "Withdraw schedule created");
});

export const listCollectionSchedules = asyncHandler(async (req, res) => {
  const data = await SchedulesService.listCollection(req.query);
  return ok(res, data, "Collection schedules");
});

export const listWithdrawSchedules = asyncHandler(async (req, res) => {
  const data = await SchedulesService.listWithdraw(req.query);
  return ok(res, data, "Withdraw schedules");
});
