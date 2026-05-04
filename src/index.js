import express from 'express';
import cors from "cors";
import path from "path";
import authRoutes from './routes/auth.routes.js';   
import dotenv from 'dotenv';
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import addressRoutes from "./routes/address.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import promotionRoutes from "./routes/promotion.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utils/swagger.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import productUploadRoutes from "./routes/productUpload.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes); 
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", apiLimiter);
app.use("/api", productUploadRoutes);
app.use("/uploads", express.static("src/uploads"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/payments", paymentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.get('/', (req, res) => {  
  res.send('API Running');
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});