import InventoryItems from "../models/inventoryItem.js";
import { userTypes } from "../utils/utils.js";

// Centralized error handler
const handleError = (res, error, message = "Internal Server Error") => {
  console.error(error); // Log the error for debugging
  res.status(500).json({ success: false, message, error }); // Send a generic error response
};

// ---------------- Helper Functions ----------------

/**
 * Fetches inventory data for a specific user.
 * Calculates expired items, low stock items, total stock count, and upcoming expiry items.
 */
const fetchInventoryData = async (userId) => {
  try {
    const now = new Date(); // Current date and time
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Date one week from now

    // Fetch expired items count
    const expiredCount = await InventoryItems.countDocuments({
      created_by: userId,
      expiry_date: { $lt: now },
    });

    // Fetch low stock items count
    const lowStockCount = await InventoryItems.countDocuments({
      created_by: userId,
      $expr: { $lt: ["$availableQuantity", "$lowStockQuantity"] },
    });

    // Fetch upcoming expiry items count (within the next 7 days)
    const upcomingExpiry = await InventoryItems.countDocuments({
      created_by: userId,
      expiry_date: { $gte: now, $lte: nextWeek },
    });

    // Fetch item names and available quantities
    const items = await InventoryItems.find(
      { created_by: userId },
      "itemName availableQuantity"
    );

    return {
      items,
      expiredCount,
      upcomingExpiry,
      lowStockCount,
    };
  } catch (error) {
    throw new Error("Error fetching inventory data: " + error.message); // Throw error for the caller to handle
  }
};

// ---------------- Controller ----------------

/**
 * Controller to fetch inventory dashboard data.
 * Determines the user ID based on the role and fetches inventory data.
 */

export const getInventoryDashboardData = async (req, res) => {
  const { role, id, created_by } = req.user; // Extract user details from the request
  const userId = role === userTypes.ADMIN ? id : created_by; // Determine user ID based on role

  try {
    const inventoryData = await fetchInventoryData(userId); // Fetch inventory data

    // Return success response with inventory data
    res.status(200).json({
      success: true,
      message: "Inventory Dashboard Data",
      result: inventoryData,
    });
  } catch (error) {
    handleError(res, error, "Failed to fetch inventory data"); // Handle errors
  }
};
