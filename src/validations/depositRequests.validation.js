import { z } from "zod";

export const createDepositRequestSchema = z.object({
  waste_type_id: z.number().int().positive(),
  estimated_weight: z.number().positive(),
  photo: z.string().url().optional().nullable(),
});

export const scheduleDepositRequestSchema = z.object({
  scheduled_date: z.string().datetime(), // ISO string expected
});

export const completeDepositRequestSchema = z.object({
  actual_weight_kg: z.number().positive(),
});
