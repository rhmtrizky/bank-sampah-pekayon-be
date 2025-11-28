import { z } from "zod";

// Helper to parse JSON string safely
const parseJsonArray = (val) => {
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return parsed;
    } catch (e) {
      return val; // let zod raise a validation error later
    }
  }
  return val;
};

export const depositRequestSchema = z.object({
  rw_id: z.coerce.number().int().positive(),
  items: z.preprocess(
    parseJsonArray,
    z
      .array(
        z.object({
          waste_type_id: z.coerce.number().int().positive(),
          weight_kg: z.coerce.number().positive(),
        })
      )
      .min(1)
  ),
  photo_url: z.string().url().optional().nullable(),
});

export const scheduleDepositRequestSchema = z.object({
  scheduled_date: z.string().datetime(), // ISO string expected
});

export const completeDepositRequestSchema = z.object({
  actual_weight_kg: z.number().positive(),
});
