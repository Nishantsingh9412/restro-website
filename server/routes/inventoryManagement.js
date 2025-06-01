import express from "express";
import {
  addInventoryItem,
  deleteItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteAllItems,
  useInventoryItem,
} from "../controllers/invenManagController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const accessInventory = accessMiddleware("Inventory-Management");

// Get all items
router.get("/get-all-items", accessInventory, getAllItems);

// Get item by id
router.get("/get-item/:id", accessInventory, getItemById);

// Add item
router.post("/add-item", accessInventory, addInventoryItem);

// Use Item
router.patch("/use-item/:id", accessInventory, useInventoryItem);

// Update item by id
router.patch("/update-item/:id", accessInventory, updateItem);

// Delete item by id
router.delete("/delete-item/:id", accessInventory, deleteItem);

// Delete all items
router.delete("/delete-all-items", accessInventory, deleteAllItems);

export default router;
