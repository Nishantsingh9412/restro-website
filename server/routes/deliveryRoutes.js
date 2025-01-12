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

router.get("/get-all/:userId", getAllDelivery);
router.get("/get-active/:userId", getActiveDelivery);
router.get("/get-completed", accessMiddleware(), getCompletedDeliveries);
router.post("/create-one", addDeliveryItem);
router.patch("/update-single/:id", updateDeliveryItem);
router.patch("/update-status/:id", updateDeliveryStatus);
router.get("/get-single/:id", getSingleDelivery);
router.delete("/delete-single/:id", deleteDeliveryItem);
router.delete("/delete-all", deleteAllDeliveryItems);
router.post("/action/:id", actionsOnDelivery);

export default router;
