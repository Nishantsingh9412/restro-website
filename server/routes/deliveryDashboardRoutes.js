import express from "express";
import { getDeliveryDashboardData } from "../controllers/deliveryDashboardController.js";

const router = express.Router();

router.get("/get/:delId", getDeliveryDashboardData);

export default router;
