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

export const updateCollectionSchedule = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const parsed = collectionScheduleSchema.parse(req.body);
  const data = await SchedulesService.updateCollection(req.user, id, parsed);
  return ok(res, data, "Collection schedule updated");
});

export const deleteCollectionSchedule = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const result = await SchedulesService.deleteCollection(req.user, id);
  return ok(res, result, "Collection schedule deleted");
});

export const updateWithdrawSchedule = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const parsed = withdrawScheduleSchema.parse(req.body);
  const data = await SchedulesService.updateWithdraw(req.user, id, parsed);
  return ok(res, data, "Withdraw schedule updated");
});

export const deleteWithdrawSchedule = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const result = await SchedulesService.deleteWithdraw(req.user, id);
  return ok(res, result, "Withdraw schedule deleted");
});
