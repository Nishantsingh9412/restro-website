import express from "express";
import {
  createDeliveryOrder,
  getDeliveryOrders,
  getDeliveryOrderById,
  updateDeliveryOrder,
  deleteDeliveryOrder,
  allotOrderDelivery,
  getOnlineDeliveryBoys,
  sendDeliveryOrderOffer,
} from "../controllers/deliveryOrderController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
const delOrderAccess = accessMiddleware("Food-And-Drinks");
// create complete order
router.post("/create-order", delOrderAccess, createDeliveryOrder);

// allot order to delivery boy
router.post("/allot-delivery/:id", delOrderAccess, allotOrderDelivery);

// send delivery order offer to delivery
router.post("/send-delivery-offer/:id", delOrderAccess, sendDeliveryOrderOffer);

// get online delivery employees
router.get(
  "/get-delivery-employees/:orderId",
  delOrderAccess,
  getOnlineDeliveryBoys
);

// get all complete orders
router.get("/get-all-delivery-orders", delOrderAccess, getDeliveryOrders);

// get single complete order
router.get("/get-single/:id", delOrderAccess, getDeliveryOrderById);

// update complete order
router.patch("/update/:id", delOrderAccess, updateDeliveryOrder);

// delete complete order
router.delete("/delete/:id", delOrderAccess, deleteDeliveryOrder);

export default router;
