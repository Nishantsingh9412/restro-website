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
const foodAndDrinksAccess = accessMiddleware(role);

router.post("/add-order-item", foodAndDrinksAccess, AddOrderItem);

router.get(
  "/get-single-order-item/:id",
  foodAndDrinksAccess,
  getSingleOrderItem
);

router.get("/get-all-order-items", foodAndDrinksAccess, getAllOrderItems);

router.get("/getDrinksOnly", foodAndDrinksAccess, getDrinksOnly);

router.patch("/update-order-item/:id", foodAndDrinksAccess, updateOrderItem);

router.delete("/delete-order-item/:id", foodAndDrinksAccess, deleteOrderItem);

router.get("/search-order-items", foodAndDrinksAccess, searchOrderItems);

router.get("/search-drinks-only", foodAndDrinksAccess, searchDrinksOnly);

// router.get(
//   "/get-personnels-by-role/:role/:order",
//   accessMiddleware(role),
//   getPersonnelsByRole
// );
export default router;
