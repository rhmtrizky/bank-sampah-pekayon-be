import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().optional().nullable(),
  phone: z.string().min(6).max(20).optional().nullable(),
  alamat: z.string().min(5).optional().nullable(),
  password: z.string().min(6),
  rt: z.number().int().positive().optional().nullable(),
  rw: z.number().int().positive(),
});

export const registerRwSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(6).max(20).optional().nullable(),
  alamat: z.string().min(5).optional().nullable(),
  password: z.string().min(6),
  rw_id: z.number().int().positive(),
});

export const loginSchema = z.object({
  emailOrPhone: z.string().min(3),
  password: z.string().min(6),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(6).max(20).optional(),
  alamat: z.string().min(5).optional(),
  rt: z.number().int().positive().optional(),
  rw: z.number().int().positive().optional(),
});
