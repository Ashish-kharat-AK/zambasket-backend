import { z } from "zod";

export const createPromotionSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(5),
  discount: z.number().min(1),
  startDate: z.string(),
  endDate: z.string()
});

export const updatePromotionSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  discount: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().optional()
});