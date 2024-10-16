import mongoose from "mongoose";
import completeOrder from "../models/completeOrder.js";
import Joi from "joi";

// Validation schema
const completeOrderSchema = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  paymentMethod: Joi.string().required(),
  deliveryMethod: Joi.string().required(),
  address: Joi.string().required(),
  address2: Joi.string().optional().allow(""),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zip: Joi.string().required(),
  noteFromCustomer: Joi.string().optional().allow(""),
  orderItems: Joi.array().required(),
  totalPrice: Joi.number().required(),
  created_by: Joi.string().required(),
});

// Function to validate order data against the schema
const validateCompleteOrder = (data) => {
  const { error } = completeOrderSchema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
};

// Controller to create a new complete order
export const createCompleteOrder = async (req, res) => {
  try {
    // Validate the request body
    validateCompleteOrder(req.body);

    // Destructure the request body
    const {
      name,
      phoneNumber,
      paymentMethod,
      deliveryMethod,
      address,
      address2,
      city,
      state,
      zip,
      noteFromCustomer,
      orderItems,
      totalPrice,
      created_by,
    } = req.body;

    // Format order items
    const formattedOrderItems = orderItems.map((item) => ({
      item: new mongoose.Types.ObjectId(item._id),
      quantity: item.quantity,
      total: item.priceVal * item.quantity,
    }));

    // Generate a unique order ID
    const orderId = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(
      1000000 + Math.random() * 9000000
    )}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    // Create a new complete order
    const newCompleteOrder = await completeOrder.create({
      name,
      phoneNumber,
      paymentMethod,
      deliveryMethod,
      address,
      address2,
      city,
      state,
      zip,
      noteFromCustomer,
      orderItems: formattedOrderItems,
      totalPrice,
      created_by,
      orderId,
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Order Added",
      result: newCompleteOrder,
    });
  } catch (err) {
    // Return error response
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Controller to get all complete orders by user ID
export const getCompleteOrders = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }
  try {
    // Find all orders created by the user and populate order items
    const completeOrders = await completeOrder
      .find({ created_by: _id })
      .populate("orderItems.item")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ success: true, message: "All Orders", result: completeOrders });
  } catch (err) {
    // Return error response
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to get a complete order by order ID
export const getCompleteOrderById = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "No Order found" });
  }
  try {
    // Find the order by ID
    const completeOrderSingle = await completeOrder.findById(_id);
    if (completeOrderSingle) {
      return res
        .status(200)
        .json({ success: true, message: "Order", result: completeOrderSingle });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
  } catch (err) {
    // Return error response
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Controller to update a complete order by order ID
export const updateCompleteOrder = async (req, res) => {
  const { id: _id } = req.params;
  try {
    // Validate the request body
    validateCompleteOrder(req.body);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res
        .status(404)
        .json({ success: false, message: "No Order found" });
    }

    // Update the order by ID
    const updatedOrder = await completeOrder.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (updatedOrder) {
      return res.status(200).json({
        success: true,
        message: "Order Updated",
        result: updatedOrder,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order not updated" });
    }
  } catch (err) {
    // Return error response
    return res.status(400).json({ success: false, message: err.message });
  }
};

// Controller to delete a complete order by order ID
export const deleteCompleteOrder = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "No Order found" });
  }
  try {
    // Delete the order by ID
    const deletedOrder = await completeOrder.findByIdAndDelete(_id);
    if (deletedOrder) {
      return res.status(200).json({
        success: true,
        message: "Order Deleted",
        result: deletedOrder,
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order not deleted" });
    }
  } catch (err) {
    // Return error response
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
