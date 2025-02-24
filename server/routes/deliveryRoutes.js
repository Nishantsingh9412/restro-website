import express from "express";
import {
  deleteAllDeliveryItems,
  addDeliveryItem,
  deleteDeliveryItem,
  getAllDelivery,
  getSingleDelivery,
  updateDeliveryItem,
  actionsOnDelivery,
  getCompletedDeliveries,
  updateDeliveryStatus,
  getActiveDelivery,
} from "../controllers/deliveryController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-all-order", accessMiddleware(), getAllDelivery);
router.get("/get-active-order", accessMiddleware(), getActiveDelivery);
router.get("/get-completed", accessMiddleware(), getCompletedDeliveries);
router.post("/create-one", accessMiddleware(), addDeliveryItem);
router.patch("/update-single/:id", accessMiddleware(), updateDeliveryItem);
router.patch("/update-status/:id", accessMiddleware(), updateDeliveryStatus);
router.get("/get-single/:id", accessMiddleware(), getSingleDelivery);
router.delete("/delete-single/:id", accessMiddleware(), deleteDeliveryItem);
router.delete("/delete-all", accessMiddleware(), deleteAllDeliveryItems);
router.post("/action/:id", accessMiddleware(), actionsOnDelivery);

export default router;
