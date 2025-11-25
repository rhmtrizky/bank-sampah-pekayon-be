import { z } from "zod";

export const rwReportQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  rw_id: z.coerce.number().int().positive().optional(),
});

export const kelurahanReportQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  kelurahan_id: z.coerce.number().int().positive().optional(),
});
