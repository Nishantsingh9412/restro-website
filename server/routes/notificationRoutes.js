import express from "express";
import {
  getAllNotifications,
  getNotificationByUser,
} from "../controllers/notificationController.js";
const router = express.Router();

router.get("/get-all", getAllNotifications);
router.get("/get-by-user/:id", getNotificationByUser);

export default router;
