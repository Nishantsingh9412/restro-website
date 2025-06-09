import express from "express";
import { getStockSummary } from "../controllers/stockController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-stock-summary", accessMiddleware(), getStockSummary);

export default router;
