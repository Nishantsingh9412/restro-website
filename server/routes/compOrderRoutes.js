import express from "express";
import {
  createCompleteOrder,
  getCompleteOrders,
  getCompleteOrderById,
  updateCompleteOrder,
  deleteCompleteOrder,
  allotOrderDelivery,
} from "../controllers/compOrderController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const compOrderAccess = accessMiddleware("Food-And-Drinks");
// create complete order
router.post("/create-order", compOrderAccess, createCompleteOrder);

// allot order to delivery boy
router.post("/allot-delivery/:id", compOrderAccess, allotOrderDelivery);

// get all complete orders
router.get("/get-all-delivery-orders", compOrderAccess, getCompleteOrders);

// get single complete order
router.get("/get-single/:id", compOrderAccess, getCompleteOrderById);

// update complete order
router.patch("/update/:id", compOrderAccess, updateCompleteOrder);

// delete complete order
router.delete("/delete/:id", compOrderAccess, deleteCompleteOrder);

export default router;
