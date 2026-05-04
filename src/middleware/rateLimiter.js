import rateLimit from "express-rate-limit";

// 🔹 Common config (reuse)
const windowTime = 15 * 60 * 1000; // 15 minutes

// 🔹 Global API limiter
const apiLimiter = rateLimit({
  windowMs: windowTime,
  max: 100,
  standardHeaders: true, // show rate limit info in headers
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later"
  }
});

// 🔹 Auth limiter (strict)
const authLimiter = rateLimit({
  windowMs: windowTime,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,   
  message: {
    success: false,
    message: "Too many login attempts, please try again later"
  }
});

// ✅ EXPORT AT BOTTOM (clean way)
export { apiLimiter, authLimiter };