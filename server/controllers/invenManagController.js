import mongoose from "mongoose";
import ItemManagement from "../models/inventoryItem.js";
import Joi from "joi";
import { generateEAN13, userTypes } from "../utils/utils.js";

// JOI Schema for item creation/update
const itemSchema = Joi.object({
  itemName: Joi.string().required(),
  category: Joi.string().optional().allow(null, ""),
  itemUnit: Joi.string().required(),
  availableQuantity: Joi.number().required(),
  lowStockQuantity: Joi.number().optional().allow(null, ""),
  barCode: Joi.string().required().allow(null, ""),
  expiryDate: Joi.date().optional().allow(null, ""),
  purchasePrice: Joi.number().optional().allow(null, ""),
  supplierName: Joi.string().optional().allow(null, ""),
  supplierContact: Joi.string().optional().allow(null, ""),
  notes: Joi.string().optional().allow(null, ""),
  storedLocation: Joi.string().optional().allow(null, ""),
}).unknown(true);

const formatRole = (role) => {
  if (!role) return "";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

// Common error handler
const handleError = (res, error, message = "Internal Server Error") => {
  console.error("ItemManagement Error:", error.message);
  return res
    .status(500)
    .json({ success: false, message, error: error.message });
};

// Get All Items
export const getAllItems = async (req, res) => {
  const { id, role, created_by } = req.user;
  try {
    const filter = { created_by: role === userTypes.ADMIN ? id : created_by };
    const items = await ItemManagement.find(filter).select("-actionHistory");
    return res
      .status(200)
      .json({ success: true, message: "All Items", result: items });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get Item by ID
export const getItemById = async (req, res) => {
  const { id: itemId } = req.params;
  const { id, role, created_by } = req.user;
  if (!mongoose.Types.ObjectId.isValid(itemId))
    return res.status(400).json({ success: false, message: "Invalid Item ID" });

  try {
    const filter = {
      _id: itemId,
      created_by: role === userTypes.ADMIN ? id : created_by,
    };
    const item = await ItemManagement.findOne(filter);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    return res
      .status(200)
      .json({ success: true, message: "Item Details", result: item });
  } catch (error) {
    return handleError(res, error);
  }
};

// Add Item
export const addInventoryItem = async (req, res) => {
  const { role, id, created_by } = req.user;
  const { error, value } = itemSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const barCode = value.barCode || generateEAN13();
    const itemData = {
      ...value,
      barCode,
      created_by: role === userTypes.ADMIN ? id : created_by,
      actionHistory: [
        {
          actionType: "created",
          user: id,
          userModel: formatRole(role),
          timestamp: new Date(),
        },
      ],
    };

    const newItem = await ItemManagement.create(itemData);
    return res
      .status(201)
      .json({ success: true, message: "Item Added", result: newItem });
  } catch (error) {
    return handleError(res, error);
  }
};

// Update Item
export const updateItem = async (req, res) => {
  const { id: itemId } = req.params;
  const { id, role, created_by } = req.user;
  if (!mongoose.Types.ObjectId.isValid(itemId))
    return res.status(400).json({ success: false, message: "Invalid Item ID" });

  const { error, value } = itemSchema.validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });

  try {
    const filter = {
      _id: itemId,
      created_by: role === userTypes.ADMIN ? id : created_by,
    };
    const updated = await ItemManagement.findOneAndUpdate(
      filter,
      {
        $set: value,
        $push: {
          actionHistory: {
            actionType: "updated",
            user: id,
            userModel: formatRole(role),
            timestamp: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Item not found or update failed" });
    return res
      .status(200)
      .json({ success: true, message: "Item Updated", result: updated });
  } catch (error) {
    return handleError(res, error);
  }
};

// Delete Item
export const deleteItem = async (req, res) => {
  const { id: itemId } = req.params;
  const { id, role, created_by } = req.user;
  if (!mongoose.Types.ObjectId.isValid(itemId))
    return res.status(400).json({ success: false, message: "Invalid Item ID" });

  try {
    const filter = {
      _id: itemId,
      created_by: role === userTypes.ADMIN ? id : created_by,
    };
    const deletedItem = await ItemManagement.findOneAndDelete(filter);
    if (!deletedItem)
      return res
        .status(404)
        .json({ success: false, message: "Item not found or delete failed" });
    return res.status(200).json({ success: true, message: "Item Deleted" });
  } catch (error) {
    return handleError(res, error);
  }
};

// Delete All Items
export const deleteAllItems = async (req, res) => {
  const { id, role, created_by } = req.user;
  try {
    const filter = { created_by: role === userTypes.ADMIN ? id : created_by };
    const result = await ItemManagement.deleteMany(filter);
    return res.status(200).json({
      success: true,
      message: "All Items Deleted",
      count: result.deletedCount,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// ✅ New Controller: Use Item (reduce quantity)
export const useInventoryItem = async (req, res) => {
  const { id: itemId } = req.params;
  const { id: userId, role, created_by } = req.user;
  const { quantityUsed } = req.body;

  if (!mongoose.Types.ObjectId.isValid(itemId))
    return res.status(400).json({ success: false, message: "Invalid Item ID" });

  if (!quantityUsed || quantityUsed <= 0)
    return res.status(400).json({
      success: false,
      message: "Quantity used must be greater than zero",
    });

  try {
    const filter = {
      _id: itemId,
      created_by: role === userTypes.ADMIN ? userId : created_by,
    };
    const item = await ItemManagement.findOne(filter);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    if (item.availableQuantity < quantityUsed) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient quantity available" });
    }

    item.availableQuantity -= quantityUsed;
    item.actionHistory.push({
      actionType: "used",
      user: userId,
      userModel: formatRole(role),
      timestamp: new Date(),
    });

    await item.save();

    return res
      .status(200)
      .json({ success: true, message: "Item Used Successfully", result: item });
  } catch (error) {
    return handleError(res, error);
  }
};
