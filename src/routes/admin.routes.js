import express from "express";
import {
  getStats,
  getRecentOrders,
  getLowStockProducts
} from "../controllers/admin.controller.js";

import { authenticate } from "../middleware/auth.js";
import { isAdmin } from "../middleware/admin.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin Dashboard APIs
 */

// 🔐 Apply auth + admin middleware to all routes
router.use(authenticate, isAdmin);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get("/stats", getStats);

/**
 * @swagger
 * /api/admin/orders/recent:
 *   get:
 *     summary: Get recent orders
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent orders
 */
router.get("/orders/recent", getRecentOrders);

/**
 * @swagger
 * /api/admin/products/low-stock:
 *   get:
 *     summary: Get low stock products
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock products list
 */
router.get("/products/low-stock", getLowStockProducts);

export default router;