import express from "express";
import { getDeliveryDashboardData } from "../controllers/deliveryDashboardController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-dashboard-data", accessMiddleware(), getDeliveryDashboardData);

export default router;
