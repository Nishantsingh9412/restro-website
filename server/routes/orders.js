import express from "express";
import {
  AddOrderItem,
  deleteOrderItem,
  getAllOrderItems,
  getSingleOrderItem,
  updateOrderItem,
} from "../controllers/OrderController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const role = "Food-And-Drinks";
const foodAndDrinksAccess = accessMiddleware(role);

router.post("/add-order-item", foodAndDrinksAccess, AddOrderItem);

router.get(
  "/get-single-order-item/:id",
  foodAndDrinksAccess,
  getSingleOrderItem
);

router.get("/get-all-order-items", foodAndDrinksAccess, getAllOrderItems);

router.patch("/update-order-item/:id", foodAndDrinksAccess, updateOrderItem);

router.delete("/delete-order-item/:id", foodAndDrinksAccess, deleteOrderItem);

export default router;
