import express from "express";
import {
  createCompleteOrder,
  getCompleteOrders,
  getCompleteOrderById,
  updateCompleteOrder,
  deleteCompleteOrder,
  allotOrderDelivery,
} from "../controllers/compOrderController.js";
import { adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// create complete order
router.post("/create", createCompleteOrder);

// allot order to delivery boy
router.post("/allot-delivery/:id", adminMiddleware, allotOrderDelivery);

// get all complete orders
router.get("/get-all/:id", getCompleteOrders);

// get single complete order
router.get("/get-single/:id", getCompleteOrderById);

// update complete order
router.patch("/update/:id", updateCompleteOrder);

// delete complete order
router.delete("/delete/:id", deleteCompleteOrder);

export default router;
