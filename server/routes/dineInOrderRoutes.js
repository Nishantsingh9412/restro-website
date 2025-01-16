import express from "express";
import {
  createDineInOrder,
  getDineInOrders,
  getDineInOrderById,
  updateDineInOrder,
  deleteDineInOrder,
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

export default router;
