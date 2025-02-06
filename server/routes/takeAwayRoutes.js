import express from "express";
import {
  createTakeAwayOrder,
  getTakeAwayOrders,
  getTakeAwayOrderById,
  updateTakeAwayOrder,
  deleteTakeAwayOrder,
  deleteAllTakeAwayOrders,
  assignTakeAwayOrderToChef,
  updateTakeAwayCurrentStatus,
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

// Assign a take-away order to a chef
router.post(
  "/assign-to-chef/:orderId",
  takeAwayAccess,
  assignTakeAwayOrderToChef
);

// Update the status of a take-away order
router.patch(
  "/update-order-status/:orderId",
  accessMiddleware(),
  updateTakeAwayCurrentStatus
);

// Export the router
export default router;
