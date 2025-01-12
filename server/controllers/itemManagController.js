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
  const { role, id, created_by } = req.user;

  try {
    // Validate request body against schema
    const { error, value } = itemSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Set `created_by` field based on the user's role
    const itemData = {
      ...value,
      created_by: role === "admin" ? id : created_by, // Admin uses their own ID; employees use their associated admin's ID
    };

    // Create new item in the database
    const newItem = await ItemManagement.create(itemData);

    return res
      .status(201)
      .json({ success: true, message: "Item Added", result: newItem });
  } catch (error) {
    return handleError(res, error);
  }
};


// Controller to get all items created by a specific user
// Updated Controller to get all items created by admin or accessible to employees
export const getAllItems = async (req, res) => {
  const { id, role } = req.user;

  try {
    let filter = {};

    if (role === "admin") {
      // Admin can fetch all items they created
      filter = { created_by: id };
    } else {
      // Employees can fetch items created by their associated admin
      filter = { created_by: req.user.created_by };
    }

    // Fetch items based on the filter
    const allItemsData = await ItemManagement.find(filter);

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

// Updated Controller to get a single item by its ID
export const getItemById = async (req, res) => {
  const { id: _id } = req.params;
  const { id: userId, role } = req.user;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ success: false, message: "Invalid Item Id" });
  }

  try {
    // Find the item and ensure it's accessible by the user
    const filter = {
      _id,
      created_by: role === "admin" ? userId : req.user.created_by,
    };

    const singleItemData = await ItemManagement.findOne(filter);

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

// Updated Controller to update an item by its ID
export const updateItem = async (req, res) => {
  const { id: _id } = req.params;
  const { id: userId, role } = req.user;

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

    // Ensure the user has access to update the item
    const filter = {
      _id,
      created_by: role === "admin" ? userId : req.user.created_by,
    };

    const updateSingleItem = await ItemManagement.findOneAndUpdate(
      filter,
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

// Updated Controller to delete an item by its ID
export const deleteItem = async (req, res) => {
  const { id: _id } = req.params;
  const { id: userId, role } = req.user;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ success: false, message: "Invalid Item Id" });
  }

  try {
    // Ensure the user has access to delete the item
    const filter = {
      _id,
      created_by: role === "admin" ? userId : req.user.created_by,
    };

    const deleteSingleItem = await ItemManagement.findOneAndDelete(filter);

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

export const deleteAllItems = async (req, res) => {
  const { id: userId, role } = req.user;

  try {
    let filter = {};

    if (role === "admin") {
      // Admin can delete all items they created
      filter = { created_by: userId };
    } else {
      // Employees can delete items created by their associated admin
      filter = { created_by: req.user.created_by };
    }

    const deleteAllItems = await ItemManagement.deleteMany(filter);

    if (!deleteAllItems) {
      return res
        .status(404)
        .json({ success: false, message: "Error Deleting Items" });
    }

    return res.status(200).json({ success: true, message: "Items Deleted" });
  } catch (error) {
    return handleError(res, error);
  }
};