import express from "express";
import {
  createDineInOrder,
  getDineInOrders,
} from "../controllers/dineInOrderController.js";

const router = express.Router();

// create dine in order
router.post("/create-dine-in", createDineInOrder);

// get all dine in orders
router.get("/get-all/:id", getDineInOrders);

export default router;
