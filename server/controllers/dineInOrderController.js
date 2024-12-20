import Joi from "joi";
import mongoose from "mongoose";
import DineInOrder from "../models/dineInOrder.js";

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
      created_by,
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
  const { id: _id } = req.params;

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }

  try {
    // Find dine-in orders created by the user and populate order items
    const dineInOrders = await DineInOrder.find({ created_by: _id })
      .populate("orderItems.item")
      .sort({ createdAt: -1 });
    console.log(dineInOrders);

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
    console.log(dineInOrder);

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

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ success: false, message: "Invalid Id" });
  }

  try {
    // Find and delete the dine-in order by ID
    const deletedDineInOrder = await DineInOrder.findByIdAndDelete(_id);

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
