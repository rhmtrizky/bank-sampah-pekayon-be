import { z } from "zod";

export const createKelurahanSchema = z.object({
  nama_kelurahan: z.string().min(3),
  kecamatan: z.string().optional().nullable(),
  kota: z.string().optional().nullable(),
});

export const updateKelurahanSchema = z.object({
  nama_kelurahan: z.string().min(3).optional(),
  kecamatan: z.string().optional().nullable(),
  kota: z.string().optional().nullable(),
});

export const createRwSchema = z.object({
  kelurahan_id: z.number().int().positive(),
  nomor_rw: z.number().int().positive(),
  name: z.string().optional().nullable(),
  phone: z.string().min(6).max(20).optional().nullable(),
  address: z.string().max(255).optional().nullable(),
});

export const updateRwSchema = z.object({
  name: z.string().optional().nullable(),
  phone: z.string().min(6).max(20).optional().nullable(),
  address: z.string().max(255).optional().nullable(),
  active: z.boolean().optional(),
});
