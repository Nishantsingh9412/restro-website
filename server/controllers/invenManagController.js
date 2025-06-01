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
  barCode: Joi.string().optional().allow(null, ""), // Made optional, no required here
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
  const { role, id, created_by, username } = req.user;
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
          quantity: value.availableQuantity,
          userName: username,
          purchasePrice: value.purchasePrice || null,
          timestamp: new Date(),
        },
      ],
    };
    const newItem = await ItemManagement.create(itemData);

    // Exclude actionHistory from response
    const { actionHistory, ...result } = newItem.toObject();

    return res.status(201).json({
      success: true,
      message: "Item Added",
      result: result,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Update Item
export const updateItem = async (req, res) => {
  const { id: itemId } = req.params;
  const { id, role, created_by, username } = req.user;

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
    const existingItem = await ItemManagement.findOne(filter);
    if (!existingItem)
      return res
        .status(404)
        .json({ success: false, message: "Item not found or update failed" });

    // Prepare change tracking
    const changes = {};
    if (
      value.availableQuantity !== undefined &&
      value.availableQuantity !== existingItem.availableQuantity
    ) {
      changes.quantityChanged = {
        from: existingItem.availableQuantity,
        to: value.availableQuantity,
      };
    }
    if (
      value.purchasePrice !== undefined &&
      value.purchasePrice !== existingItem.purchasePrice
    ) {
      changes.priceChanged = {
        from: existingItem.purchasePrice,
        to: value.purchasePrice,
      };
    }

    const updated = await ItemManagement.findOneAndUpdate(
      filter,
      {
        $set: value,
        $push: {
          actionHistory: {
            actionType: "updated",
            user: id,
            userName: username,
            quantity: value.availableQuantity || null,
            purchasePrice: value.purchasePrice || null,
            userModel: formatRole(role),
            changes,
            timestamp: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    ).select("-actionHistory");

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

// Use Item (reduce quantity)
export const useInventoryItem = async (req, res) => {
  const { id: itemId } = req.params;
  const { id: userId, role, created_by, username } = req.user;
  const { quantityUsed } = req.body;
  console.log(username);
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
      userName: username,
      userModel: formatRole(role),
      quantity: quantityUsed,
    });

    await item.save();

    return res
      .status(200)
      .json({ success: true, message: "Item Used Successfully", result: item });
  } catch (error) {
    return handleError(res, error);
  }
};

export const getInventoryItemReports = async (req, res) => {
  const { id, role, created_by } = req.user;
  const userId = role === userTypes.ADMIN ? id : created_by;
  const { id: itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({ success: false, message: "Invalid Item ID" });
  }

  try {
    // Monthly purchase price for this item
    const year = new Date().getFullYear();
    const purchaseData = await ItemManagement.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(itemId),
          created_by: new mongoose.Types.ObjectId(userId),
        },
      },
      { $unwind: "$actionHistory" },
      {
        $match: {
          "actionHistory.actionType": "created",
          "actionHistory.timestamp": {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$actionHistory.timestamp" } },
          totalPurchaseQuantity: { $sum: "$actionHistory.quantity" },
          totalPurchasePrice: {
            $sum: {
              $multiply: [
                "$actionHistory.quantity",
                "$actionHistory.purchasePrice",
              ],
            },
          },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);
    const monthlyPurchasePrice = Array.from({ length: 12 }, (_, i) => {
      const found = purchaseData.find((d) => d._id.month === i + 1);
      return {
        month: new Date(2000, i).toLocaleString("default", { month: "short" }),
        purchaseQuantity: found?.totalPurchaseQuantity || 0,
        purchasePrice: found?.totalPurchasePrice || 0,
      };
    });

    // Monthly stock data for this item
    const monthlyData = await ItemManagement.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(itemId),
          created_by: new mongoose.Types.ObjectId(userId),
        },
      },
      { $unwind: "$actionHistory" },
      {
        $match: {
          "actionHistory.timestamp": {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lt: new Date(`${year + 1}-01-01T00:00:00Z`),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$actionHistory.timestamp" },
            actionType: "$actionHistory.actionType",
          },
          count: { $sum: "$actionHistory.quantity" },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          actions: {
            $push: {
              type: "$_id.actionType",
              count: "$count",
            },
          },
        },
      },
      {
        $project: {
          month: "$_id",
          _id: 0,
          purchase: {
            $sum: {
              $map: {
                input: "$actions",
                as: "a",
                in: {
                  $cond: [{ $eq: ["$$a.type", "created"] }, "$$a.count", 0],
                },
              },
            },
          },
          usage: {
            $sum: {
              $map: {
                input: "$actions",
                as: "a",
                in: { $cond: [{ $eq: ["$$a.type", "used"] }, "$$a.count", 0] },
              },
            },
          },
        },
      },
      { $sort: { month: 1 } },
    ]);
    const monthlyStockData = Array.from({ length: 12 }, (_, i) => {
      const found = monthlyData.find((d) => d.month === i + 1);
      return {
        month: new Date(2000, i).toLocaleString("default", { month: "short" }),
        purchase: found?.purchase || 0,
        usage: found?.usage || 0,
      };
    });

    // Daily usage for this item
    const start = new Date(`${year}-01-01T00:00:00Z`);
    const end = new Date();
    const usageData = await ItemManagement.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(itemId),
          created_by: new mongoose.Types.ObjectId(userId),
        },
      },
      { $unwind: "$actionHistory" },
      {
        $match: {
          "actionHistory.actionType": "used",
          "actionHistory.timestamp": { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$actionHistory.timestamp" },
            day: { $dayOfMonth: "$actionHistory.timestamp" },
          },
          usage: { $sum: "$actionHistory.quantity" },
        },
      },
    ]);
    const usageMap = new Map(
      usageData.map((d) => [`${d._id.month}-${d._id.day}`, d.usage])
    );
    const dailyUsage = [];
    let current = new Date(start);
    while (current <= end) {
      const key = `${current.getMonth() + 1}-${current.getDate()}`;
      dailyUsage.push({
        date: current.toISOString().slice(0, 10),
        usage: usageMap.get(key) || 0,
      });
      current.setDate(current.getDate() + 1);
    }

    return res.status(200).json({
      success: true,
      message: "Inventory Item Reports",
      result: {
        monthlyPurchasePrice,
        monthlyStockData,
        dailyUsage,
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch inventory data");
  }
};
