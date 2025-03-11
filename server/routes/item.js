import express from "express";
import {
  addItem,
  deleteItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteAllItems,
} from "../controllers/itemManagController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const accessInventory = accessMiddleware("Inventory-Management");

// Get all items
router.get("/get-all-items", accessInventory, getAllItems);

// Get item by id
router.get("/get-item/:id", accessInventory, getItemById);

// Add item
router.post("/additem", accessInventory, addItem);

// Update item by id
router.patch("/updateitem/:id", accessInventory, updateItem);

// Delete item by id
router.delete("/deleteitem/:id", accessInventory, deleteItem);

// Delete all items
router.delete("/delete-all-items", accessInventory, deleteAllItems);

export default router;
