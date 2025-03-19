import Joi from "joi";
import mongoose from "mongoose";
import TakeAwayOrder from "../models/takeAwayOrder.js";
import Chef from "../models/employees/chefModel.js";
import Notification from "../models/notification.js";
import { notifyUser, sendTakeawayOffer } from "../utils/socket.js";

// Define the schema for validating take-away orders
const takeAwayOrderSchema = Joi.object({
  customerName: Joi.string().required(),
  orderItems: Joi.array().required(),
  totalPrice: Joi.number().required(),
  created_by: Joi.string().required(),
});

// Function to validate take-away order data against the schema
const validateTakeAwayOrder = (data) => {
  const { error } = takeAwayOrderSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

// Controller function to create a new take-away order
export const createTakeAwayOrder = async (req, res) => {
  try {
    // Validate the request body
    validateTakeAwayOrder(req.body);

    const { customerName, orderItems, totalPrice, created_by } = req.body;

    // Format the order items
    const formattedOrderItems = orderItems.map((item) => ({
      item: new mongoose.Types.ObjectId(item._id),
      subItems: item.selectedSubItems?.map((subItem) => ({
        _id: new mongoose.Types.ObjectId(subItem._id),
        name: subItem.name,
      })),
      quantity: item.quantity,
      total: item.priceVal * item.quantity,
    }));

    const orderId = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(
      1000000 + Math.random() * 9000000
    )}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    // Create a new take-away order in the database
    const newTakeAwayOrder = await TakeAwayOrder.create({
      orderId,
      customerName,
      orderItems: formattedOrderItems,
      totalPrice,
      created_by: req.user.role === "admin" ? created_by : req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Take Away Order Added",
      result: newTakeAwayOrder,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// Controller function to get all take-away orders
export const getTakeAwayOrders = async (req, res) => {
  const { id: _id, role, created_by } = req.user;

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }
  try {
    const allTakeAwayOrders = await TakeAwayOrder.find({
      created_by: role === "admin" ? _id : created_by,
    })
      .populate("orderItems.item", "-subItems")
      .populate("assignedChef", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "All Take Away Orders",
      result: allTakeAwayOrders,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Controller function to get a take-away order by ID
export const getTakeAwayOrderById = async (req, res) => {
  const { id: _id } = req.params;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No Take Away Order with that id");
  }

  try {
    const takeAwayOrder = await TakeAwayOrder.findById(_id);
    res.status(200).json({
      success: true,
      message: "Take Away Order Found",
      result: takeAwayOrder,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Controller function to update a take-away order by ID
export const updateTakeAwayOrder = async (req, res) => {
  const { id: _id } = req.params;
  const { customerName, orderItems, totalPrice } = req.body;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No Take Away Order with that id");
  }

  // Validate required fields
  if (!validateFields([customerName, orderItems, totalPrice])) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const updatedTakeAwayOrder = await TakeAwayOrder.findByIdAndUpdate(
      _id,
      {
        ...req.body,
        created_by:
          req.user.role === "admin" ? req.body.created_by : req.user.id,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Take Away Order Updated",
      result: updatedTakeAwayOrder,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Controller function to delete a take-away order by ID
export const deleteTakeAwayOrder = async (req, res) => {
  const { id: _id } = req.params;

  // Validate the ID
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No Take Away Order with that id");
  }

  try {
    await TakeAwayOrder.findByIdAndRemove(_id);
    res.status(200).json({ success: true, message: "Take Away Order Deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Helper function to validate required fields
const validateFields = (fields) => {
  return fields.every((field) => field !== null && field !== "");
};

//Delete all take-away orders
export const deleteAllTakeAwayOrders = async (req, res) => {
  try {
    await TakeAwayOrder.deleteMany({});
    res
      .status(200)
      .json({ success: true, message: "All Take Away Orders Deleted" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Assign take away order to chef
export const assignTakeAwayOrderToChef = async (req, res) => {
  try {
    const user = req.user;
    const { orderId } = req.params;
    const { chefId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(chefId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const order = await TakeAwayOrder.findOne({ orderId: orderId });
    const chef = await Chef.findById(chefId);

    if (!order || !chef) {
      return res.status(404).json({ message: "Order or Chef not found" });
    }

    order.assignedChef = chefId;
    order.currentStatus = "Assigned";
    await updateStatusHistory(order, user, "Assigned");
    await order.save();

    chef.assignedOrders.push(order._id);
    await chef.save();

    await sendTakeawayOffer(chefId, order);

    const notification = await Notification.create({
      sender: user.id,
      receiver: chefId,
      heading: "New Take Away Order Assigned",
      body: `You have been assigned a new take away order with Order ID: ${order.orderId}.`,
    });

    if (notification) {
      await notifyUser(chefId, notification);
    }

    return res.status(200).json({
      success: true,
      message: "Order assigned to chef",
      result: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update take away order status
export const updateTakeAwayCurrentStatus = async (req, res) => {
  try {
    const user = req.user;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // find take away order by order id
    const order = await TakeAwayOrder.findOne({ orderId: orderId }).populate(
      "orderItems.item"
    );
    // check if order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // find chef by id
    const chef = await Chef.findById(order.assignedChef);
    if (!chef) {
      return res.status(404).json({ message: "Chef not found" });
    }

    // check if status is completed
    if (status === "Completed") {
      order.completedAt = new Date();
    }

    // check if status is rejected
    if (status === "Rejected") {
      chef.assignedOrders = chef.assignedOrders.filter(
        (orderId) => orderId.toString() !== order._id.toString()
      );
      order.assignedChef = null;
      await chef.save();
    }

    // update status history
    await updateStatusHistory(order, user, status);
    order.currentStatus = status;
    await order.save();

    // create notification
    const notification = await Notification.create({
      sender: user.id,
      receiver: user.created_by,
      heading: "Take-Away order status updated",
      body: `Your take-away order ${orderId} status has been changed to ${status} by ${user.name}`,
    });
    // send notification
    if (notification) {
      await notifyUser(notification.receiver, notification);
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      result: order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update status history
const updateStatusHistory = async (order, user, status) => {
  const validStatuses = [
    "Available",
    "Assigned",
    "Accepted",
    "Ready",
    "Preparing",
    "Cancelled",
    "Completed",
    "Rejected",
  ];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status update");
  }

  order.statusHistory.push({
    status,
    updatedBy: user.id,
    updatedByModel: user.role,
    updatedAt: new Date(),
  });
  await order.save();
};
