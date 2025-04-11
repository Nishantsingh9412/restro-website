import mongoose from "mongoose";
import OrderedItems from "../models/orderModel.js";
import Joi from "joi";

// Function to validate MongoDB ObjectId
const validateObjectId = (id, res, entity = "Item") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ success: false, message: `Invalid ${entity} ID` });
    return false;
  }
  return true;
};

// Function to handle errors and send a response
const handleError = (res, err, message) => {
  console.error(message, err.message);
  res.status(500).json({ success: false, message: "Internal Server Error" });
};

// Function to handle responses
const handleResponse = (res, success, message, result = null) => {
  res.status(success ? 200 : 400).json({ success, message, result });
};

// Joi schema for validating order items
const orderItemSchema = Joi.object({
  _id: Joi.string().optional(),
  itemId: Joi.string().required(),
  itemName: Joi.string().required(),
  category: Joi.string().required(),
  customization: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().required(),
        maxSelect: Joi.number().required(),
        required: Joi.boolean().optional().default(false),
        option: Joi.array()
          .items(
            Joi.object({
              name: Joi.string().required(),
              price: Joi.number().required(),
            })
          )
          .required(),
      })
    )
    .optional()
    .allow(null, ""),
  basePrice: Joi.number().required(),
  priceUnit: Joi.string().required(),
  prepTime: Joi.number().required(),
  pic: Joi.string().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
  isFavourite: Joi.boolean().optional().default(false),
  inStock: Joi.boolean().optional().default(false),
});

// Controller to add a new order item
export const AddOrderItem = async (req, res) => {
  try {
    const { error } = orderItemSchema.validate(req.body);
    if (error) {
      return handleResponse(res, false, error.details[0].message);
    }

    const { role, id, created_by } = req.user;
    const userId = role === "admin" ? id : created_by;

    const {
      itemId,
      itemName,
      category,
      prepTime,
      basePrice,
      priceUnit,
      pic,
      description,
      isFavourite,
      inStock,
      customization,
    } = req.body;

    const itemIdExist = await OrderedItems.findOne({ itemId });
    if (itemIdExist) {
      return handleResponse(res, false, "Item ID already exists");
    }

    const newOrderItem = await OrderedItems.create({
      itemId,
      itemName,
      category,
      prepTime,
      basePrice,
      priceUnit,
      pic,
      description,
      isFavourite,
      inStock,
      customization,
      created_by: userId,
    });
    if (!newOrderItem) {
      return handleResponse(res, false, "Failed to add Order Items");
    }

    handleResponse(res, true, "Added Order Items", newOrderItem);
  } catch (err) {
    handleError(res, err, "Error from AddOrderItem Controller:");
  }
};

// Controller to get a single order item by ID
export const getSingleOrderItem = async (req, res) => {
  const { id: _id } = req.params;
  if (!validateObjectId(_id, res, "Order Item")) return;

  try {
    const orderItem = await OrderedItems.findById(_id);
    if (!orderItem) {
      return handleResponse(res, false, "Failed to get Order Item");
    }

    handleResponse(res, true, "Single Order Item", orderItem);
  } catch (err) {
    handleError(res, err, "Error from getSingleOrderItem Controller:");
  }
};

// Controller to get all order items for a specific user
export const getAllOrderItems = async (req, res) => {
  const { role, id, created_by } = req.user;
  const userId = role === "admin" ? id : created_by;

  if (!validateObjectId(userId, res, "User")) return;

  try {
    const allOrderItems = await OrderedItems.find({
      created_by: userId,
    }).sort({ isFavourite: -1, orderName: 1 });
    if (!allOrderItems) {
      return handleResponse(res, false, "Failed to get Order Items");
    }

    handleResponse(res, true, "All Order Items", allOrderItems);
  } catch (err) {
    handleError(res, err, "Error from getAllOrderItems Controller:");
  }
};

// Controller to update an order item by ID
export const updateOrderItem = async (req, res) => {
  const { id: _id } = req.params;
  if (!validateObjectId(_id, res, "Order Item")) return;

  try {
    const { error } = orderItemSchema.validate(req.body, {
      allowUnknown: true,
    });
    if (error) {
      return handleResponse(res, false, error.details[0].message);
    }

    const {
      itemId,
      itemName,
      category,
      prepTime,
      basePrice,
      priceUnit,
      pic,
      description,
      isFavourite,
      inStock,
      customization,
    } = req.body;
    const updatedOrderItem = await OrderedItems.findByIdAndUpdate(
      _id,
      {
        $set: {
          itemId,
          itemName,
          category,
          prepTime,
          basePrice,
          priceUnit,
          pic,
          description,
          isFavourite,
          inStock,
          customization,
        },
      },
      { new: true }
    );

    if (!updatedOrderItem) {
      return handleResponse(res, false, "Failed to update Order Item");
    }

    handleResponse(res, true, "Updated Order Item", updatedOrderItem);
  } catch (err) {
    handleError(res, err, "Error from updateOrderItem Controller:");
  }
};

// Controller to delete an order item by ID
export const deleteOrderItem = async (req, res) => {
  const { id: _id } = req.params;
  if (!validateObjectId(_id, res, "Order Item")) return;

  try {
    const deletedOrderItem = await OrderedItems.findByIdAndDelete(_id);
    if (!deletedOrderItem) {
      return handleResponse(res, false, "Failed to delete Order Item");
    }

    handleResponse(res, true, "Deleted Order Item");
  } catch (err) {
    handleError(res, err, "Error from deleteOrderItem Controller:");
  }
};
