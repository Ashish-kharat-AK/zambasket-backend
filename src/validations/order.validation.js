import { z } from "zod";

export const createOrderSchema = z.object({
  // optional: cart auto 
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "CANCELLED"])
});