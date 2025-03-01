import mongoose from "mongoose";
import Delivery from "../models/delivery.js";
import notification from "../models/notification.js";
import { hideDeliveryOffer, notifyUser } from "../utils/socket.js";
// import authDeliv from "../models/authDeliv.js";
import deliveryBoy from "../models/deliveryBoyModel.js";

// Helper function to validate ID
const validateId = (id, res, message) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message });
    return false;
  }
  return true;
};

// Helper function to send error response
const sendErrorResponse = (res, status, message) => {
  res.status(status).json({ success: false, message });
};

// Add a new delivery item
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

    // Validate required fields
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
      return sendErrorResponse(
        res,
        400,
        "Please provide all the required fields"
      );
    }

    // Create new delivery item
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
      return sendErrorResponse(res, 400, "Failed to add delivery");
    }

    return res.status(201).json({
      success: true,
      message: "Added delivery",
      result: newDelivery,
    });
  } catch (err) {
    console.log("Error from AddDeliveryItem Controller : ", err.message);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Get a single delivery item by ID
export const getSingleDelivery = async (req, res) => {
  const { id: _id } = req.params;

  if (!validateId(_id, res, "Invalid delivery Item ID")) return;

  try {
    const deliveryItem = await Delivery.findById(_id);

    if (!deliveryItem) {
      return sendErrorResponse(res, 400, "Failed to get Delivery Item");
    }

    return res.status(200).json({
      success: true,
      message: "Single Delivery Item",
      result: deliveryItem,
    });
  } catch (err) {
    console.log("Error from getSingleDelivery Controller : ", err.message);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Get active delivery for a user
export const getActiveDelivery = async (req, res) => {
  const { id: userId } = req.user;

  if (!validateId(userId, res, "Invalid delivery Item ID")) return;

  try {
    const activeDelivery = await Delivery.findOne({
      assignedTo: userId,
      currentStatus: { $in: ["Accepted", "Picked up"] },
    });

    return res.status(200).json({
      success: true,
      message: "Active Delivery",
      result: activeDelivery,
    });
  } catch (err) {
    console.log("Error from getActiveDelivery Controller : ", err.message);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Get completed deliveries for a user
export const getCompletedDeliveries = async (req, res) => {
  const userId = req.user.id;

  if (!validateId(userId, res, "Invalid delivery Item ID")) return;

  try {
    const completedDeliveries = await Delivery.find({
      assignedTo: userId,
      currentStatus: "Completed",
    }).sort({ completedAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Completed Deliveries",
      result: completedDeliveries,
    });
  } catch (err) {
    console.log("Error from getCompletedDeliveries Controller : ", err.message);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Get all delivery items for a user
export const getAllDelivery = async (req, res) => {
  const { id: userId } = req.user;

  if (!validateId(userId, res, "Invalid User ID")) return;

  try {
    const allDeliveryItems = await Delivery.find({
      assignedTo: userId,
      currentStatus: { $ne: "Completed" },
    }).sort({ createdAt: -1 });

    if (!allDeliveryItems) {
      return sendErrorResponse(res, 400, "Failed to get Delivery Items");
    }

    return res.status(200).json({
      success: true,
      message: "All Delivery Items",
      result: allDeliveryItems,
    });
  } catch (err) {
    console.log("Error from getAllDelivery Controller : ", err.message);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Perform actions (Accept/Reject) on a delivery item
export const actionsOnDelivery = async (req, res) => {
  const { id: _id } = req.params;
  const { userId, action } = req.body;

  if (!validateId(_id, res, "Invalid Delivery Item ID")) return;
  if (!userId) {
    return sendErrorResponse(res, 404, "User not found");
  }

  try {
    // const delPer = await deliveryPersonnel.findById(userId).select("name");
    if (!delPer) {
      return sendErrorResponse(res, 404, "Delivery Personnel not found");
    }

    const deliveryItem = await Delivery.findById(_id).select(
      "currentStatus orderId _id"
    );
    if (deliveryItem.currentStatus !== "Available") {
      return sendErrorResponse(res, 400, "Delivery already accepted");
    }

    if (action === "Accept") {
      const acceptedDeliveryItem = await Delivery.findByIdAndUpdate(
        _id,
        {
          currentStatus: "Accepted",
          $push: {
            statusHistory: {
              status: "Accepted",
              timestamp: new Date(),
            },
          },
        },
        { new: true }
      );

      if (!acceptedDeliveryItem) {
        return sendErrorResponse(res, 400, "Failed to accept Delivery Item");
      }

      const noti = await notification.create({
        sender: userId,
        receiver: acceptedDeliveryItem.created_by,
        heading: "Order delivery accepted",
        body: `Your delivery order ${acceptedDeliveryItem.orderId} has been accepted by ${delPer.name}`,
      });
      if (noti) await notifyUser(noti.receiver, noti);

      return res.status(200).json({
        success: true,
        message: "Accepted Delivery Item",
        result: acceptedDeliveryItem,
      });
    } else {
      const noti = await notification.create({
        sender: userId,
        receiver: deliveryItem._id,
        heading: "Order delivery rejected",
        body: `Your delivery order ${deliveryItem.orderId} has been rejected by ${delPer.name}`,
      });
      if (noti) await notifyUser(noti.receiver, noti);

      return res.status(200).json({
        success: true,
        message: "Rejected Delivery Item",
      });
    }
  } catch (err) {
    console.log("Error from actionsOnDelivery Controller : ", err.message);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Update a delivery item
export const updateDeliveryItem = async (req, res) => {
  const { id: _id } = req.params;

  if (!validateId(_id, res, "Invalid Delivery Item ID")) return;

  try {
    if (!Object.keys(req.body).length) {
      return sendErrorResponse(res, 400, "Provide data to update");
    }

    const updatedDeliveryItem = await Delivery.findByIdAndUpdate(
      _id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedDeliveryItem) {
      return sendErrorResponse(res, 400, "Failed to update Delivery Item");
    }

    return res.status(200).json({
      success: true,
      message: "Updated Delivery Item",
      result: updatedDeliveryItem,
    });
  } catch (err) {
    console.log("Error from updateDeliveryItem Controller : ", err.message);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  const { id: _id } = req.params;
  const { userId, status } = req.body;

  if (!validateId(_id, res, "Invalid Delivery Item ID")) return;
  if (!validateId(userId, res, "Invalid User ID")) return;

  try {
    const delPer = await deliveryBoy.findById(userId).select("name");
    if (!delPer) {
      return sendErrorResponse(res, 404, "Delivery Personnel not found");
    }

    if (!Object.keys(req.body).length) {
      return sendErrorResponse(res, 400, "Provide data to update");
    }

    const updatedDeliveryItem = await Delivery.findByIdAndUpdate(
      _id,
      {
        $set: {
          currentStatus: status,
          completedAt: status === "Completed" ? new Date() : null,
        },
        $push: {
          statusHistory: {
            status: status,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedDeliveryItem) {
      return sendErrorResponse(res, 400, "Failed to update status");
    }

    const noti = await notification.create({
      sender: userId,
      receiver: updatedDeliveryItem.created_by,
      heading: "Order delivery status update",
      body: `Your delivery order ${updatedDeliveryItem.orderId} status has been changed to ${updatedDeliveryItem.currentStatus} by ${delPer.name}`,
    });
    if (noti) await notifyUser(noti.receiver, noti);

    return res.status(200).json({
      success: true,
      message: "Updated Delivery Item",
      result: updatedDeliveryItem,
    });
  } catch (err) {
    console.log("Error from updateDeliveryStatus Controller : ", err.message);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Delete a delivery item
export const deleteDeliveryItem = async (req, res) => {
  const { id: _id } = req.params;

  if (!validateId(_id, res, "Invalid Delivery Item ID")) return;

  try {
    const deletedDeliveryItem = await Delivery.findByIdAndDelete(_id);
    if (!deletedDeliveryItem) {
      return sendErrorResponse(res, 400, "Failed to delete Delivery Item");
    }

    return res.status(200).json({
      success: true,
      result: deletedDeliveryItem,
      message: "Deleted Delivery Item",
    });
  } catch (err) {
    console.log("Error from deleteDeliveryItem Controller : ", err.message);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};

// Delete all delivery items
export const deleteAllDeliveryItems = async (req, res) => {
  try {
    const deletedAllDeliveries = await Delivery.deleteMany();

    if (!deletedAllDeliveries) {
      return sendErrorResponse(res, 500, "Delivery Items not deleted");
    }

    return res.status(200).json({
      success: true,
      message: "All Delivery Items Deleted",
      result: deletedAllDeliveries,
    });
  } catch (err) {
    console.log("Error from deleteAllDeliveryItems Controller : ", err.message);
    return sendErrorResponse(res, 500, "Internal Server Error");
  }
};
