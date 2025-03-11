import express from "express";

import {
  getChefDashboardData,
  getChefActiveOrder,
  getChefAllOrders,
} from "../../controllers/employees/chefController.js";
import { accessMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

// get all shift of a chef
router.get("/get-dashboard-data", accessMiddleware(), getChefDashboardData);

// get active orders
router.get("/get-active-order", accessMiddleware(), getChefActiveOrder);

// get all orders
router.get("/get-all-orders", accessMiddleware(), getChefAllOrders);

export default router;
