import { z } from "zod";

export const offlineTransactionSchema = z.object({
  user_id: z.number().int().positive(), // warga user id
  waste_type_id: z.number().int().positive(),
  weight_kg: z.number().positive(),
});
