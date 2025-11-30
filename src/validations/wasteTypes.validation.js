export const updatePriceListSchema = z.object({
  buy_price: z.number().nonnegative().optional(),
  sell_price: z.number().nonnegative().optional(),
  effective_date: z.string().datetime().optional(),
});
import { z } from "zod";

export const createWasteTypeSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
});

export const updateWasteTypeSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
});

export const createPriceListSchema = z.object({
  waste_type_id: z.number().int().positive(),
  buy_price: z.number().nonnegative(),
  sell_price: z.number().nonnegative(),
  effective_date: z.string().datetime().optional(),
});
