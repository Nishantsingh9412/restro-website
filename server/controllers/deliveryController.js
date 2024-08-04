import mongoose from "mongoose";
import Delivery from "../models/delivery.js";
import deliveryPersonnel from "../models/deliveryPersonnel.js";
import notification from "../models/notification.js";
import { hideDeliveryOffer, notifyUser } from "../utils/socket.js";
import authDeliv from "../models/authDeliv.js";

export const addDeliveryItem = async (req, res) => {
  try {
    const {
      orderId,
      pickupLocation,
      deliveryLocation,
      distance,
      estimatedTime,
      orderItems,
      customerName,
      customerContact,
      restaurantName,
      restaurantImage,
      paymentType,
      currentStatus,
      statusHistory,
    } = req.body;
    if (
      !orderId ||
      !distance ||
      !estimatedTime ||
      !customerName ||
      !customerContact ||
      !restaurantName ||
      !restaurantImage ||
      !paymentType ||
      !currentStatus ||
      !pickupLocation?.lat ||
      !pickupLocation?.lng ||
      !deliveryLocation?.lat ||
      !deliveryLocation?.lng ||
      !orderItems?.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    } else {
      const newDelivery = await Delivery.create({
        orderId,
        pickupLocation,
        deliveryLocation,
        distance,
        estimatedTime,
        orderItems,
        customerName,
        customerContact,
        restaurantName,
        restaurantImage,
        paymentType,
        currentStatus,
        statusHistory,
      });
      if (!newDelivery) {
        return res.status(400).json({
          success: false,
          message: "Failed to add delivery",
        });
      } else {
        return res.status(201).json({
          success: true,
          message: "Added delivery",
          result: newDelivery,
        });
      }
    }
  } catch (err) {
    console.log("Error from AddDeliveryItem Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getSingleDelivery = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid delivery Item ID" });
  }
  try {
    const GetSingleDeliveryItemById = await Delivery.findById(_id);
    if (!GetSingleDeliveryItemById) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to get Delivery Item" });
    } else {
      return res.status(200).json({
        success: true,
        message: "Single Delivery Item",
        result: GetSingleDeliveryItemById,
      });
    }
  } catch (err) {
    console.log("Error from getSingleDelivery Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getActiveDelivery = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid delivery Item ID" });
    }

    const active = await Delivery.findOne({
      assignedTo: userId,
      currentStatus: { $in: ["Accepted", "Picked up"] },
    });

    return res.status(200).json({
      success: true,
      message: "Active Delivery",
      result: active,
    });
  } catch (err) {
    console.log("Error from getActiveDelivery Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getCompletedDeliveries = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid delivery Item ID" });
    }

    const completed = await Delivery.find({
      assignedTo: userId,
      currentStatus: "Completed",
    }).sort({ completedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Completed Deliveries",
      result: completed,
    });
  } catch (err) {
    console.log("Error from getCompletedDeliveries Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
export const getAllDelivery = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID" });
    }

    const allDeliveryItems = await Delivery.find({
      assignedTo: userId,
      currentStatus: { $ne: "Completed" },
    }).sort({
      createdAt: -1,
    });
    if (!allDeliveryItems) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to get Delivery Items" });
    } else {
      return res.status(200).json({
        success: true,
        message: "All Delivery Items",
        result: allDeliveryItems,
      });
    }
  } catch (err) {
    console.log("Error from getAllDelivery Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const actionsOnDelivery = async (req, res) => {
  try {
    const { id: _id } = req.params;
    const { userId, action } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Delivery Item ID" });
    }
    if (!userId)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const delPer = await deliveryPersonnel.findById(userId).select("name");
    if (!delPer)
      return res
        .status(404)
        .json({ success: false, message: "Delivery Personnel not found" });

    const isAvailable = await Delivery.findById(_id).select(
      "currentStatus",
      "orderId",
      "_id"
    );
    if (isAvailable.currentStatus !== "Available")
      return res
        .status(400)
        .json({ success: false, message: "Delivery already accepted" });

    if (action === "Accept") {
      const acceptSingleDeliveryItem = await Delivery.findByIdAndUpdate(
        _id,
        {
          currentStatus: "Accepted",
          statusHistory: {
            $push: {
              status: "Accepted",
              timestamp: new Date(),
            },
          }, // Add the new status and timestamp to the statusHistory array
        },
        { new: true }
      );
      if (!acceptSingleDeliveryItem) {
        return res
          .status(400)
          .json({ success: false, message: "Failed to accept Delivery Item" });
      }

      const noti = await notification.create({
        sender: userId,
        receiver: acceptSingleDeliveryItem.supplier,
        heading: "Order delivery accepted",
        body: `Your delivery order ${acceptSingleDeliveryItem.orderId} has been accepted by ${delPer.name}`,
      });
      if (noti) await notifyUser(noti.receiver, noti);

      return res.status(200).json({
        success: true,
        message: "Accepted Delivery Item",
        result: acceptSingleDeliveryItem,
      });
    } else {
      const noti = await notification.create({
        sender: userId,
        receiver: isAvailable._id,
        heading: "Order delivery rejected",
        body: `Your delivery order ${isAvailable.orderId} has been rejected by ${delPer.name}`,
      });
      if (noti) await notifyUser(noti.receiver, noti);

      return res.status(200).json({
        success: true,
        message: "Rejected Delivery Item",
        // result: acceptSingleDeliveryItem,
      });
    }
  } catch (err) {
    console.log("Error from acceptDelivery Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateDeliveryItem = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Delivery Item ID" });
  }
  try {
    if (!Object.keys(req.body).length)
      return res
        .status(400)
        .json({ success: false, message: "Provide data to update" });
    const updateDeliverySingleItem = await Delivery.findByIdAndUpdate(
      _id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );

    if (!updateDeliverySingleItem) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to update Delivery Item" });
    } else {
      {
        return res.status(200).json({
          success: true,
          message: "Updated Delivery Item",
          result: updateDeliverySingleItem,
        });
      }
    }
  } catch (err) {
    console.log("Error from updateDeliveryItem Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const updateDilveryStatus = async (req, res) => {
  const { id: _id } = req.params;
  const { userId, status } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Delivery Item ID" });
    }
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User ID" });
    }

    const delPer = await authDeliv.findById(userId).select("name");
    if (!delPer)
      return res
        .status(404)
        .json({ success: false, message: "Delivery Personnel not found" });

    if (!Object.keys(req.body).length)
      return res
        .status(400)
        .json({ success: false, message: "Provide data to update" });
    const updateDeliverySingleItem = await Delivery.findByIdAndUpdate(
      _id,
      {
        $set: {
          currentStatus: status,
          statusHistory: {
            $push: {
              status: status,
              updatedAt: new Date(),
            },
          },
          completedAt: status === "Completed" ? new Date() : null,
        },
      },
      { new: true }
    );
    if (!updateDeliverySingleItem) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to update status" });
    } else {
      const noti = await notification.create({
        sender: userId,
        receiver: updateDeliverySingleItem.supplier,
        heading: "Order delivery status update",
        body: `Your delivery order ${updateDeliverySingleItem.orderId} status has been changed to ${updateDeliverySingleItem.currentStatus} by ${delPer.name}`,
      });
      if (noti) await notifyUser(noti.receiver, noti);

      return res.status(200).json({
        success: true,
        message: "Updated Delivery Item",
        result: updateDeliverySingleItem,
      });
    }
  } catch (err) {
    console.log("Error from updateDeliveryItem Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteDeliveryItem = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Delivery Item ID" });
  }
  try {
    const deleteSingleDeliveryItem = await Delivery.findByIdAndDelete(_id);
    if (!deleteSingleDeliveryItem) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to delete Delivery Item" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Deleted Delivery Item" });
    }
  } catch (err) {
    console.log("Error from deleteDeliveryItem Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteAllDeliveryItems = async (req, res) => {
  try {
    const delAllDeli = await Delivery.deleteMany();
    if (delAllDeli) {
      return res.status(200).json({
        success: true,
        message: "All Delivery Items Deleted",
        result: delAllDeli,
      });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "Delivery Items not deleted" });
    }
  } catch (err) {
    console.log("Error from deleteAllDeliveryItems Controller : ", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
