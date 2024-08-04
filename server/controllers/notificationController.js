import mongoose from "mongoose";
import Notification from "../models/notification.js";

export const getNotificationByUser = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID" });
    }
    const notifications = await Notification.find({ receiver: id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      message: "Notifications retreived",
      result: notifications,
    });
  } catch (err) {
    console.log("Error from getNotificationByUser Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Notifications retreived",
      result: notifications,
    });
  } catch (err) {
    console.log("Error from getAllNotifications Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
