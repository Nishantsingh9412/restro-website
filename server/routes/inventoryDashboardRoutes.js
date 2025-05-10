import { Router } from "express";
import { getInventoryDashboardData } from "../controllers/inventoryDashboard.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

const accessInventory = accessMiddleware("Inventory-Management");

// Dashboard Data
router.get("/get-dashboard-data", accessInventory, getInventoryDashboardData);

// Export the router
export default router;
