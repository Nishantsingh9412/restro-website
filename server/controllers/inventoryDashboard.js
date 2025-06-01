import InventoryItems from "../models/inventoryItem.js";
import { userTypes } from "../utils/utils.js";
import mongoose from "mongoose";

// Centralized error handler
const handleError = (res, error, message = "Internal Server Error") => {
  console.error(error);
  res
    .status(500)
    .json({ success: false, message, error: error.message || error });
};

// ---------------- Helper Functions ----------------

// Fetch monthly purchase price aggregation
export const getMonthlyPurchasePrice = async (userId) => {
  const year = new Date().getFullYear();

  const purchaseData = await InventoryItems.aggregate([
    { $match: { created_by: new mongoose.Types.ObjectId(userId) } },
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
        // sum total quantity created * purchasePrice (assuming price per unit constant)
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

  // Fill missing months with zeros
  const fullYearPurchase = Array.from({ length: 12 }, (_, i) => {
    const found = purchaseData.find((d) => d._id.month === i + 1);
    return {
      month: new Date(2000, i).toLocaleString("default", { month: "short" }),
      purchaseQuantity: found?.totalPurchaseQuantity || 0,
      purchasePrice: found?.totalPurchasePrice || 0,
    };
  });

  return fullYearPurchase;
};

// Fetch monthly stock created and used counts
export const getMonthlyStockData = async (userId) => {
  const year = new Date().getFullYear();

  const monthlyData = await InventoryItems.aggregate([
    { $match: { created_by: new mongoose.Types.ObjectId(userId) } },
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
              in: { $cond: [{ $eq: ["$$a.type", "created"] }, "$$a.count", 0] },
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

  // Fill missing months with 0
  const fullYearData = Array.from({ length: 12 }, (_, i) => {
    const found = monthlyData.find((d) => d.month === i + 1);
    return {
      month: new Date(2000, i).toLocaleString("default", { month: "short" }),
      purchase: found?.purchase || 0,
      usage: found?.usage || 0,
    };
  });

  return fullYearData;
};

// Fetch daily usage count till today
export const getDailyUsageTillNow = async (
  userId,
  year = new Date().getFullYear()
) => {
  const start = new Date(`${year}-01-01T00:00:00Z`);
  const end = new Date(); // today

  const usageData = await InventoryItems.aggregate([
    { $match: { created_by: new mongoose.Types.ObjectId(userId) } },
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

  // Map for fast lookup
  const usageMap = new Map(
    usageData.map((d) => [`${d._id.month}-${d._id.day}`, d.usage])
  );

  const result = [];
  let current = new Date(start);
  while (current <= end) {
    const key = `${current.getMonth() + 1}-${current.getDate()}`;
    result.push({
      date: current.toISOString().slice(0, 10),
      usage: usageMap.get(key) || 0,
    });
    current.setDate(current.getDate() + 1);
  }

  return result;
};

// Fetch overall expired, low stock, upcoming expiry counts
export const fetchInventoryData = async (userId) => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const expiredCount = await InventoryItems.countDocuments({
    created_by: userId,
    expiryDate: { $lt: now },
  });

  const lowStockCount = await InventoryItems.countDocuments({
    created_by: userId,
    $expr: { $lt: ["$availableQuantity", "$lowStockQuantity"] },
  });

  const upcomingExpiry = await InventoryItems.countDocuments({
    created_by: userId,
    expiryDate: { $gte: now, $lte: nextWeek },
  });

  const inventoryItems = await InventoryItems.find(
    { created_by: userId },
    "itemName availableQuantity"
  );

  // Use aggregation pipeline to unwind actionHistory and sort by timestamp desc
  const recentActions = await InventoryItems.aggregate([
    { $match: { created_by: new mongoose.Types.ObjectId(userId) } },
    { $unwind: "$actionHistory" },
    { $sort: { "actionHistory.timestamp": -1 } },
    { $limit: 5 },
    {
      $project: {
        _id: 0,
        itemId: "$_id",
        itemName: "$itemName",
        actionType: "$actionHistory.actionType",
        // user: "$actionHistory.user",
        userName: "$actionHistory.userName",
        // userModel: "$actionHistory.userModel",
        quantity: "$actionHistory.quantity",
        // purchasePrice: "$actionHistory.purchasePrice",
        // changes: "$actionHistory.changes",
        timestamp: "$actionHistory.timestamp",
      },
    },
  ]);

  return {
    inventoryItems,
    expiredCount,
    lowStockCount,
    upcomingExpiry,
    recentActions,
  };
};

// ---------------- Controller ----------------

/**
 * Main dashboard controller to get inventory data and analytics.
 */
export const getInventoryDashboardData = async (req, res) => {
  const { role, id, created_by } = req.user;
  const userId = role === userTypes.ADMIN ? id : created_by;

  try {
    const inventoryData = await fetchInventoryData(userId);
    const dailyUsage = await getDailyUsageTillNow(userId);
    const monthlyStockData = await getMonthlyStockData(userId);
    const monthlyPurchasePrice = await getMonthlyPurchasePrice(userId);

    res.status(200).json({
      success: true,
      message: "Inventory Dashboard Data",
      result: {
        ...inventoryData,
        charts: {
          monthlyStockData,
          monthlyPurchasePrice,
          dailyUsage,
        },
      },
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch inventory data");
  }
};
