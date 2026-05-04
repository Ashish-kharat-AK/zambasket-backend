// import { z } from "zod";

// export const registerSchema = z.object({
//   name: z.string().min(3, "Name must be at least 3 characters"),
//   email: z.string().email("Invalid email"),
//   password: z.string().min(6, "Password must be at least 6 characters")
// });

// export const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6)
// });

// export const updateProfileSchema = z.object({
//   name: z.string().min(3).optional(),
//   email: z.string().email().optional()
// });

// export const changePasswordSchema = z.object({
//   oldPassword: z.string().min(6),
//   newPassword: z.string().min(6)
// });
import { z } from "zod";

// ✅ REGISTER
export const registerSchema = z.object({
  name: z.string()
    .min(3, "Name must be at least 3 characters")
    .max(50),

  email: z.string()
    .email("Invalid email format"),

  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(20)
    .regex(/[A-Z]/, "Must include uppercase letter")
    .regex(/[0-9]/, "Must include number")
});

// ✅ LOGIN
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// ✅ UPDATE PROFILE
export const updateProfileSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional()
});

// ✅ CHANGE PASSWORD
export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string()
    .min(6)
    .regex(/[A-Z]/, "Must include uppercase")
    .regex(/[0-9]/, "Must include number")
});