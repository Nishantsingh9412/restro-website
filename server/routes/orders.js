import express from "express";
import {
  AddOrderItem,
  deleteOrderItem,
  getAllOrderItems,
  getDrinksOnly,
  getSingleOrderItem,
  searchDrinksOnly,
  searchOrderItems,
  updateOrderItem,
} from "../controllers/OrderController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";
// import { getPersonnelsByRole } from "../controllers/PersonnelController.js";

const router = express.Router();

const role = "Food-And-Drinks";

router.post("/add-order-item", accessMiddleware(role), AddOrderItem);

router.get(
  "/get-single-order-item/:id",
  accessMiddleware(role),
  getSingleOrderItem
);

router.get("/get-all-order-items", accessMiddleware(role), getAllOrderItems);

router.get("/getDrinksOnly", accessMiddleware(role), getDrinksOnly);

router.patch("/update-order-item/:id", accessMiddleware(role), updateOrderItem);

router.delete(
  "/delete-order-item/:id",
  accessMiddleware(role),
  deleteOrderItem
);

router.get("/search-order-items/:id", accessMiddleware(role), searchOrderItems);

router.get("/search-drinks-only/:id", accessMiddleware(role), searchDrinksOnly);

// router.get(
//   "/get-personnels-by-role/:role/:order",
//   accessMiddleware(role),
//   getPersonnelsByRole
// );
export default router;
