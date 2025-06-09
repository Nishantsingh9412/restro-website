import express from "express";
import {
  getAdminDashboardDataController,
  getContactOfSupplierController,
} from "../controllers/dashboardController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard routes
router.get(
  "/admin-dashboard",
  accessMiddleware(),
  getAdminDashboardDataController
);

// Get Contact Info
router.get(
  "/supplier-contacts",
  accessMiddleware(),
  getContactOfSupplierController
);

export default router;
