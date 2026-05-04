import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadProductImage } from "../controllers/productUpload.controller.js";

const router = express.Router();

router.post("/upload-product-image", upload.single("image"), uploadProductImage);

export default router;