import express from "express";
import {
  getAllNotifications,
  getNotificationByAdmin,
  getNotificationByEmployee,
} from "../controllers/notificationController.js";
import {
  employeeMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get all notifications
router.get("/get-all", getAllNotifications);

// Route to get notifications for a specific employee, protected by employeeMiddleware
router.get(
  "/get-emp-notification",
  employeeMiddleware,
  getNotificationByEmployee
);

// Route to get notifications for admin, protected by adminMiddleware
router.get("/get-admin-notification", adminMiddleware, getNotificationByAdmin);

export default router;
