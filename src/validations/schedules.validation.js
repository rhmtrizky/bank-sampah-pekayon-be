import { z } from "zod";

export const collectionScheduleSchema = z.object({
  date: z.string().datetime(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  description: z.string().max(255).optional().nullable(),
});

export const withdrawScheduleSchema = z.object({
  date: z.string().datetime(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
});
