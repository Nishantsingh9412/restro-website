import express from "express";

import {
  getWaiterDashboardData,
  getWaiterActiveOrder,
  getWaiterAllOrders,
} from "../../controllers/employees/waiterController.js";
import { accessMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

// get all shift of a waiter
router.get("/get-dashboard-data", accessMiddleware(), getWaiterDashboardData);

// get active orders
router.get("/get-active-order", accessMiddleware(), getWaiterActiveOrder);

// get all orders
router.get("/get-all-orders", accessMiddleware(), getWaiterAllOrders);

export default router;
