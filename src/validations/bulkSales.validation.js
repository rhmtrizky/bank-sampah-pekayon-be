import { z } from "zod";

export const createPengepulSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6).max(20).optional().nullable(),
  address: z.string().max(255).optional().nullable(),
});

export const createBulkSaleSchema = z.object({
  pengepul_id: z.number().int().positive(),
  items: z
    .array(
      z.object({
        waste_type_id: z.number().int().positive(),
        weight_kg: z.number().positive(),
      })
    )
    .min(1),
  date: z.string().datetime().optional(),
});
