import express from "express";
import {
  createTakeAwayOrder,
  getTakeAwayOrders,
  getTakeAwayOrderById,
  updateTakeAwayOrder,
  deleteTakeAwayOrder,
  deleteAllTakeAwayOrders,
} from "../controllers/takeAwayController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const takeAwayAccess = accessMiddleware("Food-And-Drinks");

// Import controllers

// Create a new take-away order
router.post("/create-take-away", takeAwayAccess, createTakeAwayOrder);

// Get all take-away orders
router.get("/get-all-take-away", takeAwayAccess, getTakeAwayOrders);

// Get a single take-away order
router.get("/get-single-take-away/:id", takeAwayAccess, getTakeAwayOrderById);

// Update a take-away order
router.patch("/update-take-away/:id", takeAwayAccess, updateTakeAwayOrder);

// Delete a take-away order
router.delete("/delete-take-away/:id", takeAwayAccess, deleteTakeAwayOrder);

// Delete all the take-away orders
router.delete("/delete-all-take-away", deleteAllTakeAwayOrders);
export default router;
