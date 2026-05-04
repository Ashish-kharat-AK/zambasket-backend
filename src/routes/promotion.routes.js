import express from "express";
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
} from "../controllers/promotion.controller.js";

import { authenticate } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";
import { validate } from "../middleware/validate.js";

import {
  createPromotionSchema,
  updatePromotionSchema
} from "../validations/promotion.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Promotions
 *   description: Promotion & Discount APIs
 */

/**
 * @swagger
 * /api/promotions:
 *   get:
 *     summary: Get all promotions
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: List of promotions
 */
router.get("/", getPromotions);

/**
 * @swagger
 * /api/promotions:
 *   post:
 *     summary: Create promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - discount
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: Diwali Sale
 *               description:
 *                 type: string
 *                 example: Flat 20% discount
 *               discount:
 *                 type: number
 *                 example: 20
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-01-01T00:00:00Z
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-01-10T00:00:00Z
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Promotion created
 */
router.post(
  "/",
  authenticate,
  isAdmin,
  validate(createPromotionSchema),
  createPromotion
);

/**
 * @swagger
 * /api/promotions/{id}:
 *   put:
 *     summary: Update promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               discount:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Promotion updated
 */
router.put(
  "/:id",
  authenticate,
  isAdmin,
  validate(updatePromotionSchema),
  updatePromotion
);

/**
 * @swagger
 * /api/promotions/{id}:
 *   delete:
 *     summary: Delete promotion (Admin only)
 *     tags: [Promotions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Promotion deleted
 */
router.delete("/:id", authenticate, isAdmin, deletePromotion);

export default router;