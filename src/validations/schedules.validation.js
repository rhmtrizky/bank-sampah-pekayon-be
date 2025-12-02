import { z } from "zod";

export const collectionScheduleSchema = z
  .object({
    title: z.string().min(1).max(150),
    date: z.string().datetime(),
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    description: z.string().max(255).optional().nullable(),
  })
  .superRefine((val, ctx) => {
    const start = new Date(val.start_time);
    const end = new Date(val.end_time);
    if (!(end > start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_time"],
        message: "end_time must be greater than start_time",
      });
    }
  });

export const withdrawScheduleSchema = z
  .object({
    title: z.string().min(1).max(150),
    date: z.string().datetime(),
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    description: z.string().max(255).optional().nullable(),
  })
  .superRefine((val, ctx) => {
    const start = new Date(val.start_time);
    const end = new Date(val.end_time);
    if (!(end > start)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_time"],
        message: "end_time must be greater than start_time",
      });
    }
  });
