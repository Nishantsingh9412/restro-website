import Joi from "joi";
import mongoose from "mongoose";
import TakeAwayOrder from "../models/takeAwayOrder.js";

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
      quantity: item.quantity,
      total: item.priceVal * item.quantity,
    }));

    // Create a new take-away order in the database
    const newTakeAwayOrder = await TakeAwayOrder.create({
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
      .populate("orderItems.item")
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
