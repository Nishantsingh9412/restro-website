import express from "express";
import {
  createDineInOrder,
  getDineInOrders,
  getDineInOrderById,
  updateDineInOrder,
  deleteDineInOrder,
  deleteAllDineInOrders,
  assignDineInOrderToChef,
  assignDineInOrderToWaiter,
  updateDineInCurrentStatus,
} from "../controllers/dineInOrderController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const dineInAccess = accessMiddleware("Food-And-Drinks");

// create dine in order
router.post("/create-dine-in", dineInAccess, createDineInOrder);

// get all dine in orders
router.get("/get-all-dine-orders", dineInAccess, getDineInOrders);

// get a single dine in order by id
router.get("/get-dine-order/:id", dineInAccess, getDineInOrderById);

// update a dine in order
router.put("/update-dine-order/:id", dineInAccess, updateDineInOrder);

// delete a dine in order
router.delete("/delete-dine-order/:id", dineInAccess, deleteDineInOrder);

// delete all dine in order
router.delete("/delete-all-dine-orders", deleteAllDineInOrders);

// assign dine in order to chef
router.post("/assign-to-chef/:orderId", dineInAccess, assignDineInOrderToChef);

// assign dine in order to waiter
router.post(
  "/assign-to-waiter/:orderId",
  dineInAccess,
  assignDineInOrderToWaiter
);

// update dine in order status
router.patch(
  "/update-order-status/:orderId",
  accessMiddleware(),
  updateDineInCurrentStatus
);

export default router;
