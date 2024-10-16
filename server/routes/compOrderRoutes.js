import express from "express";
import {
  createCompleteOrder,
  getCompleteOrders,
  getCompleteOrderById,
  updateCompleteOrder,
  deleteCompleteOrder,
} from "../controllers/compOrderController.js";

const router = express.Router();

// create complete order
router.post("/create", createCompleteOrder);

// get all complete orders
router.get("/get-all/:id", getCompleteOrders);

// get single complete order
router.get("/get-single/:id", getCompleteOrderById);

// update complete order
router.patch("/update/:id", updateCompleteOrder);

// delete complete order
router.delete("/delete/:id", deleteCompleteOrder);

export default router;
