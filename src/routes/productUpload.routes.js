import express from "express";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// ✅ IMAGE UPLOAD ROUTE
router.post(
  "/upload-product-image",
  upload.single("image"), // 👈 frontend मधला name match हवा
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      res.json({
        image: req.file.filename, // 👈 हे frontend ला जातं
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;