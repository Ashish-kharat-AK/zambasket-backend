import express from "express";
import { cacheMiddleware } from "../middleware/cache.js";
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword
} from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";

import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema
} from "../validations/auth.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

// 🔓 Public Routes

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 */
router.post(
  "/register",
  authLimiter, // 🔥 Rate limit
  validate(registerSchema),
  register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post(
  "/login",
  authLimiter, // 🔥 Rate limit
  validate(loginSchema),
  login
);    

// 🔐 Protected Routes
router.use(authenticate);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 */
router.get(
  "/me",
  cacheMiddleware, // 🔥 Cache added
  getMe
);

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     summary: Update profile
 */
router.put(
  "/me",
  validate(updateProfileSchema),
  updateMe
);

/**
 * @swagger
 * /api/auth/me/password:
 *   put:
 *     summary: Change password
 */
router.put(
  "/me/password",
  validate(changePasswordSchema),
  changePassword
);

export default router;