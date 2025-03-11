import express from "express";
import {
  getAllNotifications,
  getNotificationByAdmin,
  getNotificationByEmployee,
} from "../controllers/notificationController.js";
import { accessMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to get all notifications
router.get("/get-all", getAllNotifications);

// Route to get notifications for a specific employee, protected by accessMiddleware
router.get(
  "/get-emp-notification",
  accessMiddleware(),
  getNotificationByEmployee
);

// Route to get notifications for admin, protected by accessMiddleware
router.get(
  "/get-admin-notification",
  accessMiddleware(),
  getNotificationByAdmin
);

export default router;
