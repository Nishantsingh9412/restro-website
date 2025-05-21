import express from "express";
import {
  getAdminDashboardDataController,
  getContactOfSupplierController,
} from "../controllers/dashboardController.js";

const router = express.Router();

// Dashboard routes
router.get("/admin-dashboard", getAdminDashboardDataController);

// Get Contact Info
router.get("/supplier-contacts", getContactOfSupplierController);

export default router;
