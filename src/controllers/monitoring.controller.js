import { MonitoringService } from "../services/monitoring.service.js";
import { asyncHandler } from "../utils/errors.js";
import { ok } from "../utils/response.js";

export const monitoringRw = asyncHandler(async (req, res) => {
  const data = await MonitoringService.rwActivity(req.user);
  return ok(res, data, "RW activity");
});

export const monitoringRt = asyncHandler(async (req, res) => {
  const rw_id = req.query.rw_id ? Number(req.query.rw_id) : undefined;
  const data = await MonitoringService.rtActivity(req.user, rw_id);
  return ok(res, data, "RT activity");
});
