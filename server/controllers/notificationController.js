import mongoose from "mongoose";
import Notification from "../models/notification.js";

// Get notifications by user ID
export const getNotificationByUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID" });
    }
    // Fetch notifications for the user
    const notifications = await Notification.find({ receiver: id }).sort({
      createdAt: -1,
    });
    if (!notifications.length) {
      return res.status(200).json({
        success: false,
        message: "No notifications found for this user",
      });
    }
    // Return notifications
    return res.status(200).json({
      success: true,
      message: "Notifications retrieved",
      result: notifications,
    });
  } catch (err) {
    console.error("Error from getNotificationByUser Controller:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Get all notifications
export const getAllNotifications = async (req, res) => {
  try {
    // Fetch all notifications
    const notifications = await Notification.find().sort({ createdAt: -1 });
    if (!notifications.length) {
      return res
        .status(200)
        .json({ success: false, message: "No notifications found" });
    }
    // Return notifications
    return res.status(200).json({
      success: true,
      message: "Notifications retrieved",
      result: notifications,
    });
  } catch (err) {
    console.error("Error from getAllNotifications Controller:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
