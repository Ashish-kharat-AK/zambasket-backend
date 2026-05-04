import express from "express";
import {
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview
} from "../controllers/review.controller.js";

import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

import {
  createReviewSchema,
  updateReviewSchema
} from "../validations/review.validation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product Review APIs
 */

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Get reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get("/product/:productId", getReviewsByProduct);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create review (1 per user per product)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 1
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Very good product!
 *     responses:
 *       200:
 *         description: Review created
 */
router.post("/", authenticate, validate(createReviewSchema), createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update review
 *     tags: [Reviews]
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
 *               rating:
 *                 type: integer
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Updated review
 *     responses:
 *       200:
 *         description: Review updated
 */
router.put("/:id", authenticate, validate(updateReviewSchema), updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete review
 *     tags: [Reviews]
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
 *         description: Review deleted
 */
router.delete("/:id", authenticate, deleteReview);

export default router;