import { asyncHandler } from "../utils/errors.js";
import { created, ok } from "../utils/response.js";
import {
  depositRequestSchema,
  scheduleDepositRequestSchema,
  completeDepositRequestSchema,
} from "../validations/depositRequests.validation.js";
import { DepositRequestsService } from "../services/depositRequests.service.js";

export const createDepositRequest = asyncHandler(async (req, res) => {
  const parsed = depositRequestSchema.parse(req.body);
  const data = await DepositRequestsService.create(req.user, parsed);
  return created(res, data, "Deposit request created");
});

export const listMyDepositRequests = asyncHandler(async (req, res) => {
  const data = await DepositRequestsService.listMine(req.user);
  return ok(res, data, "My deposit requests");
});

export const getDepositRequestDetail = asyncHandler(async (req, res) => {
  const data = await DepositRequestsService.detail(req.user, req.params.id);
  return ok(res, data, "Deposit request detail");
});

export const scheduleDepositRequest = asyncHandler(async (req, res) => {
  const parsed = scheduleDepositRequestSchema.parse(req.body);
  const data = await DepositRequestsService.schedule(
    req.user,
    Number(req.params.id),
    parsed
  );
  return ok(res, data, "Deposit request scheduled");
});

export const completeDepositRequest = asyncHandler(async (req, res) => {
  const parsed = completeDepositRequestSchema.parse(req.body);
  const data = await DepositRequestsService.complete(
    req.user,
    Number(req.params.id),
    parsed
  );
  return ok(res, data, "Deposit request completed");
});

// new
export const cancelDepositRequest = asyncHandler(async (req, res) => {
  const data = await DepositRequestsService.cancel(
    req.user,
    Number(req.params.id)
  );
  return ok(res, data, "Deposit request canceled");
});
