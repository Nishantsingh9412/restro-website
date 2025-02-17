import Joi from "joi";
import mongoose from "mongoose";
import DineInOrder from "../models/dineInOrder.js";
import Waiter from "../models/employees/waiterModel.js";
import Chef from "../models/employees/chefModel.js";
import Notification from "../models/notification.js";
import { notifyUser } from "../utils/socket.js";

// Define the schema for validating dine-in orders
const dineInOrderSchema = Joi.object({
  tableNumber: Joi.string().required(),
  numberOfGuests: Joi.number().required(),
  customerName: Joi.string().optional().allow(""),
  phoneNumber: Joi.string().optional().allow(""),
  emailAddress: Joi.string().optional().allow(""),
  specialRequests: Joi.string().optional().allow(""),
  orderItems: Joi.array().required(),
  totalPrice: Joi.number().required(),
  created_by: Joi.string().required(),
});

// Function to validate dine-in order data against the schema
const validateDineInOrder = (data) => {
  const { error } = dineInOrderSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

// Controller function to create a new dine-in order
export const createDineInOrder = async (req, res) => {
  const { id: _id, role, created_by: adminID } = req.user;
  try {
    // Validate the request body
    validateDineInOrder(req.body);

    const {
      tableNumber,
      numberOfGuests,
      customerName,
      phoneNumber,
      emailAddress,
      specialRequests,
      orderItems,
      totalPrice,
      created_by,
    } = req.body;

    // Format the order items
    const formattedOrderItems = orderItems.map((item) => ({
      item: new mongoose.Types.ObjectId(item._id),
      quantity: item.quantity,
      total: item.priceVal * item.quantity,
    }));

    // Generate a unique order ID
    const orderId = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(
      1000000 + Math.random() * 9000000
    )}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    // Create a new dine-in order in the database
    const newDineInOrder = await DineInOrder.create({
      tableNumber,
      numberOfGuests,
      customerName,
      phoneNumber,
      emailAddress,
      specialRequests,
      orderItems: formattedOrderItems,
      totalPrice,
      created_by: role === "admin" ? _id : adminID,
      orderId,
    });

    // Respond with success message and the created order
    return res.status(201).json({
      success: true,
      message: "Order Added",
      result: newDineInOrder,
    });
  } catch (err) {
    // Handle validation or database errors
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Controller function to get dine-in orders by user ID
export const getDineInOrders = async (req, res) => {
  const { id: _id, role, created_by } = req.user;

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }

  try {
    // Find dine-in orders by user ID and populate order items
    const dineInOrders = await DineInOrder.find({
      created_by: role === "admin" ? _id : created_by,
    })
      .populate("orderItems.item")
      .populate("assignedWaiter", "name")
      .populate("assignedChef", "name")
      .sort({ createdAt: -1 });

    // Check if any orders were found
    if (!dineInOrders || dineInOrders.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No orders found" });
    }

    // Respond with success message and the retrieved orders
    return res.status(200).json({
      success: true,
      message: "Dine-in Orders retrieved",
      result: dineInOrders,
    });
  } catch (err) {
    // Handle database errors
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Controller function to get a dine-in order by order ID
export const getDineInOrderById = async (req, res) => {
  const { id: _id } = req.params;

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }

  try {
    // Find the dine-in order by ID and populate order items
    const dineInOrder = await DineInOrder.findById(_id).populate(
      "orderItems.item"
    );

    // Respond with success message and the retrieved order
    return res.status(200).json({
      success: true,
      message: "Dine-in Order retrieved",
      result: dineInOrder,
    });
  } catch (err) {
    // Handle database errors
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Controller function to update a dine-in order by order ID
export const updateDineInOrder = async (req, res) => {
  const { id: _id } = req.params;
  const { id: userId, role, created_by: adminID } = req.user;

  try {
    // Validate the request body
    validateDineInOrder(req.body);

    const {
      tableNumber,
      numberOfGuests,
      customerName,
      phoneNumber,
      emailAddress,
      specialRequests,
      orderItems,
      totalPrice,
    } = req.body;

    // Format the order items
    const formattedOrderItems = orderItems.map((item) => ({
      item: new mongoose.Types.ObjectId(item._id),
      quantity: item.quantity,
      total: item.priceVal * item.quantity,
    }));

    // Update the dine-in order in the database
    const updatedDineInOrder = await DineInOrder.findByIdAndUpdate(
      _id,
      {
        tableNumber,
        numberOfGuests,
        customerName,
        phoneNumber,
        emailAddress,
        specialRequests,
        orderItems: formattedOrderItems,
        totalPrice,
        created_by: role === "admin" ? userId : adminID,
      },
      { new: true }
    );

    // Respond with success message and the updated order
    return res.status(200).json({
      success: true,
      message: "Dine-in Order Updated",
      result: updatedDineInOrder,
    });
  } catch (err) {
    // Handle validation or database errors
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Controller function to delete a dine-in order by order ID
export const deleteDineInOrder = async (req, res) => {
  const { id: _id } = req.params;
  const { id: userId, role, created_by: adminID } = req.user;

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }

  try {
    // Find and delete the dine-in order by ID
    const deletedDineInOrder = await DineInOrder.findOneAndDelete({
      _id,
      created_by: role === "admin" ? userId : adminID,
    });

    // Respond with success message and the deleted order
    return res.status(200).json({
      success: true,
      message: "Dine-in Order Deleted",
      result: deletedDineInOrder,
    });
  } catch (err) {
    // Handle database errors
    return res.status(400).json({ success: false, message: err.message });
  }
};

//delelte all dine in orders
export const deleteAllDineInOrders = async (req, res) => {
  console.log("Deleted");
  try {
    const deletedDineInOrders = await DineInOrder.deleteMany();
    return res.status(200).json({
      success: true,
      message: "All Dine-in Orders Deleted",
      result: deletedDineInOrders,
    });
  } catch (err) {
    // Handle database errors
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Assign dine in order to waiter
export const assignDineInOrderToWaiter = async (req, res) => {
  try {
    const user = req.user;
    const { orderId } = req.params;
    const { waiterId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(waiterId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const order = await DineInOrder.findOne({ orderId: orderId });
    const waiter = await Waiter.findById(waiterId);

    if (!order || !waiter) {
      return res.status(404).json({ message: "Order or Waiter not found" });
    }

    order.assignedWaiter = waiterId;
    order.currentStatus = "Assigned";
    await updateStatusHistory(order, user, "Assigned");
    await order.save();

    waiter.assignedOrders.push(order._id);
    await waiter.save();

    const notification = await Notification.create({
      sender: user.id,
      receiver: waiterId,
      heading: "New Dine-In Order Assigned",
      body: `You have been assigned a new dine-in order with Order ID: ${order.orderId}.`,
    });

    if (notification) {
      await notifyUser(waiterId, notification);
    }

    return res.status(200).json({
      success: true,
      message: "Order assigned to waiter",
      result: order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
// Assign dine in order to chef
export const assignDineInOrderToChef = async (req, res) => {
  try {
    const user = req.user;
    const { orderId } = req.params;
    const { chefId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(chefId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const order = await DineInOrder.findOne({ orderId: orderId });
    const chef = await Chef.findById(chefId);

    if (!order || !chef) {
      return res.status(404).json({ message: "Order or Chef not found" });
    }

    order.assignedChef = chefId;
    order.currentStatus = "Assigned To Chef";
    await updateStatusHistory(order, user, "Assigned To Chef");
    await order.save();

    chef.assignedOrders.push(order._id);
    await chef.save();

    const notification = await Notification.create({
      sender: user.id,
      receiver: chefId,
      heading: "New Dine-In Order Assigned",
      body: `You have been assigned a new dine-in order with Order ID: ${order.orderId}.`,
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
    res.status(500).json({ message: "Server error", error });
  }
};

// Update dine in order status
export const updateDineInCurrentStatus = async (req, res) => {
  try {
    const user = req.user;
    const { orderId } = req.params;
    const { status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(user.id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    // find dine in order by order id
    const order = await DineInOrder.findOne({ orderId: orderId }).populate(
      "orderItems.item"
    );
    // check if order exists
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // check if order is completed
    if (status === "Completed") {
      order.completedAt = new Date();
    }
    // check if order is rejected
    if (status === "Rejected") {
      if (user.role === "Waiter") {
        const waiter = await Waiter.findById(order.assignedWaiter);
        if (waiter) {
          waiter.assignedOrders = waiter.assignedOrders.filter(
            (orderId) => orderId.toString() !== order._id.toString()
          );
          order.assignedWaiter = null;
          await waiter.save();
        }
      } else if (user.role === "Chef") {
        const chef = await Chef.findById(order.assignedChef);
        chef.assignedOrders = chef.assignedOrders.filter(
          (orderId) => orderId.toString() !== order._id.toString()
        );
        order.assignedChef = null;
        await chef.save();
      }
    }

    // update status history
    await updateStatusHistory(order, user, status);
    order.currentStatus = status;
    await order.save();

    const notification = await Notification.create({
      sender: user.id,
      receiver: user.created_by,
      heading: "Dine-In order status updated",
      body: `Your dine-in order ${orderId} status has been changed to ${status} by ${user.name}`,
    });

    if (notification) {
      await notifyUser(notification.receiver, notification);
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${order.currentStatus}`,
      result: order,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.log(error);
  }
};

// Update status history
const updateStatusHistory = async (order, user, status) => {
  const validStatuses = [
    "Available",
    "Assigned",
    "Accepted",
    "Assigned To Chef",
    "Accepted By Chef",
    "Ready",
    "Preparing",
    "Served",
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
