import express from "express";
const router = express.Router();
import { sendMessage, getMessage } from "../controllers/messageControllers.js";
import protectedRoute from "../middleware/protectedRouted.js";
import upload from "../middleware/uploadImage.js";

router.post("/send/:id", protectedRoute, sendMessage);
router.get("/:id", protectedRoute, getMessage);
router.post(
  "/upload-image",
  protectedRoute,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    // Return the image URL
    res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
  }
);
router.post(
  "/upload-audio",
  protectedRoute,
  upload.single("audio"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No audio uploaded" });
    }
    // Return the audio URL
    res.status(201).json({ audioUrl: `/uploads/${req.file.filename}` });
  }
);

export default router;
