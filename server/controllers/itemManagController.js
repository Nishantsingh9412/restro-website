import mongoose from "mongoose";
import ItemManagement from "../models/itemManage.js";
import Joi from "joi";

// Validation schema for item data
const itemSchema = Joi.object({
  item_name: Joi.string().required(),
  item_unit: Joi.string().required(),
  available_quantity: Joi.number().required(),
  minimum_quantity: Joi.number().required(),
  bar_code: Joi.string().required(),
  expiry_date: Joi.date().required().allow(null, ""),
  created_by: Joi.string().required(),
  existing_barcode_no: Joi.string().optional().allow(null, ""),
  // usage_rate_unit: Joi.string().optional(),
  // usage_rate_value: Joi.number().optional(),
});

// Error handling function
const handleError = (res, error, message = "Internal Server Error") => {
  console.error("Error from ItemManagement Controller:", error.message);
  return res.status(500).json({ success: false, message });
};

// Controller to add a new item
export const addItem = async (req, res) => {
  try {
    // Validate request body against schema
    const { error, value } = itemSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Create new item in the database
    const newItem = await ItemManagement.create(value);
    return res
      .status(201)
      .json({ success: true, message: "Item Added", result: newItem });
  } catch (error) {
    return handleError(res, error);
  }
};

// Controller to get all items created by a specific user
export const getAllItems = async (req, res) => {
  const { id: _id } = req.params;
  try {
    // Find all items created by the user
    const allItemsData = await ItemManagement.find({ created_by: _id });
    if (allItemsData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Items Found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "All Items", result: allItemsData });
  } catch (error) {
    return handleError(res, error);
  }
};

// Controller to get a single item by its ID
export const getItemById = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ success: false, message: "Invalid Item Id" });
  }
  try {
    // Find item by ID
    const singleItemData = await ItemManagement.findById(_id);
    if (!singleItemData) {
      return res.status(404).json({ success: false, message: "No Item Found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Single Item", result: singleItemData });
  } catch (error) {
    return handleError(res, error);
  }
};

// Controller to update an item by its ID
export const updateItem = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ success: false, message: "Invalid Item Id" });
  }

  try {
    // Validate request body against schema
    const { error, value } = itemSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Update item in the database
    const updateSingleItem = await ItemManagement.findByIdAndUpdate(
      _id,
      { $set: value },
      { new: true, runValidators: true }
    );
    if (!updateSingleItem) {
      return res
        .status(404)
        .json({ success: false, message: "Error Updating Item" });
    }
    return res.status(200).json({
      success: true,
      message: "Item Updated",
      result: updateSingleItem,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Controller to delete an item by its ID
export const deleteItem = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ success: false, message: "Invalid Item Id" });
  }
  try {
    // Delete item from the database
    const deleteSingleItem = await ItemManagement.findByIdAndDelete(_id);
    if (!deleteSingleItem) {
      return res
        .status(404)
        .json({ success: false, message: "Error Deleting Item" });
    }
    return res.status(200).json({ success: true, message: "Item Deleted" });
  } catch (error) {
    return handleError(res, error);
  }
};

// Controller to delete all items (for development purposes only)
export const deleteAllItems = async (req, res) => {
  try {
    // Delete all items from the database
    const deleteAllItems = await ItemManagement.deleteMany();
    return res
      .status(200)
      .json({ success: true, message: "All Items Deleted" });
  } catch (error) {
    return handleError(res, error);
  }
};
