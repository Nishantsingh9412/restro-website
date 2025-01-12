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

//  get all items
router.get(
  "/get-all-items",
  accessMiddleware("Inventory-Management"),
  getAllItems
);

// Get Item by id
router.get(
  "/get-item/:id",
  accessMiddleware("Inventory-Management"),
  getItemById
);

// Add All items
router.post("/additem", accessMiddleware("Inventory-Management"), addItem);

// Update Item by id
router.patch(
  "/updateitem/:id",
  accessMiddleware("Inventory-Management"),
  updateItem
);

// Delete Item by id
router.delete(
  "/deleteitem/:id",
  accessMiddleware("Inventory-Management"),
  deleteItem
);

// Delete All Items
router.delete(
  "/delete-all-items",
  accessMiddleware("Inventory-Management"),
  deleteAllItems
);

export default router;
