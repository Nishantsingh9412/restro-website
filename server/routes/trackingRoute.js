import express from "express";
import { accessMiddleware } from "../middleware/authMiddleware.js";
import { generateTrackingToken } from "../controllers/trackingController.js";

const router = express.Router();

router.post("/generate-token", accessMiddleware(), generateTrackingToken);

export default router;
