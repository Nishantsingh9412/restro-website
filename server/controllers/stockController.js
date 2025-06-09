import mongoose from "mongoose";
import ItemManagement from "../models/inventoryItem.js";

// Function to check if a given ID is a valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Function to handle error responses
const handleErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

// Function to handle success responses
const handleSuccessResponse = (res, message, result) => {
  return res.status(200).json({ success: true, message, result });
};

// Controller to get all stock items and low stock items in a single API call
export const getStockSummary = async (req, res) => {
  const { id: userId } = req.user;

  // Validate the user ID
  if (!isValidObjectId(userId)) {
    return handleErrorResponse(res, 400, "Invalid User Id");
  }

  try {
    // Query to find all items created by the current user
    const allStockItems = await ItemManagement.find({ created_by: userId });

    // Filter low stock items (availableQuantity <= lowStockQuantity)
    const lowStockItems = await ItemManagement.find({
      created_by: userId,
      $expr: { $lte: ["$availableQuantity", "$lowStockQuantity"] },
    });

    // Return both in a single response
    return handleSuccessResponse(res, "Stock Summary", {
      allStockItems,
      lowStockItems,
    });
  } catch (error) {
    // Log the error and return an error response
    console.error("Error from ItemManagement Controller:", error.message);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};
