import {
  rwReportQuerySchema,
  kelurahanReportQuerySchema,
} from "../validations/reports.validation.js";
import { ReportsService } from "../services/reports.service.js";
import { asyncHandler } from "../utils/errors.js";
import { ok } from "../utils/response.js";

export const getRwReport = asyncHandler(async (req, res) => {
  const parsed = rwReportQuerySchema.parse(req.query);
  const data = await ReportsService.rwMonthly(req.user, parsed);
  return ok(res, data, "RW monthly report");
});

export const getKelurahanReport = asyncHandler(async (req, res) => {
  const parsed = kelurahanReportQuerySchema.parse(req.query);
  const data = await ReportsService.kelurahanMonthly(req.user, parsed);
  return ok(res, data, "Kelurahan monthly report");
});
