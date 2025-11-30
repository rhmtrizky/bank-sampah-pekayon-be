import { z } from "zod";

export const createWargaSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(6).max(20),
  alamat: z.string().min(5).optional().nullable(),
  password: z.string().min(6),
  rt: z.number().int().positive().optional().nullable(),
});
