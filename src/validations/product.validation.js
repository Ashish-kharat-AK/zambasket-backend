import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  price: z.number().positive(),
  categoryId: z.number(), // ✅ FIX
  isFeatured: z.boolean().optional()
});

export const updateProductSchema = z.object({ 
  name: z.string().min(3).optional(),
  description: z.string().min(5).optional(),
  price: z.number().positive().optional(),
  category: z.string().optional(),
  isFeatured: z.boolean().optional()
});