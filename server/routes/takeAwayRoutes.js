import express from "express";

const router = express.Router();

// Import controllers
import {
  createTakeAwayOrder,
  getTakeAwayOrders,
  getTakeAwayOrderById,
  updateTakeAwayOrder,
  deleteTakeAwayOrder,
} from "../controllers/takeAwayController.js";

// Create a new take-away order
router.post("/create-take-away", createTakeAwayOrder);

// Get all take-away orders
router.get("/get-all-take-away/:id", getTakeAwayOrders);

// Get a single take-away order
router.get("/get-single-take-away/:id", getTakeAwayOrderById);

// Update a take-away order
router.patch("/update-take-away/:id", updateTakeAwayOrder);

// Delete a take-away order
router.delete("/delete-take-away/:id", deleteTakeAwayOrder);

export default router;
