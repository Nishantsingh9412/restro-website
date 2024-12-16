import mongoose from "mongoose";
import ItemManagement from "../models/itemManage.js";

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

// Controller to get items with low stock
export const getLowStockItems = async (req, res) => {
  const { id: userId } = req.params;

  // Validate the user ID
  if (!isValidObjectId(userId)) {
    return handleErrorResponse(res, 400, "Invalid User Id");
  }

  try {
    // Query to find items with available_quantity less than 70% of minimum_quantity and created by the current user
    const lowStockItems = await ItemManagement.find({
      $and: [
        {
          $expr: {
            $lte: [
              "$available_quantity",
              { $multiply: [0.3, "$minimum_quantity"] },
            ],
          }, // Check if available_quantity is less than 70% of minimum_quantity
        },
        { created_by: userId }, // Ensure the items belong to the current user
      ],
    });

    // Return success response with the low stock items
    return handleSuccessResponse(res, "Low Stock Items", lowStockItems);
  } catch (error) {
    // Log the error and return an error response
    console.error("Error from ItemManagement Controller:", error.message);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

// Controller to get all stock items
export const getAllStockItems = async (req, res) => {
  const { id: userId } = req.params;

  // Validate the user ID
  if (!isValidObjectId(userId)) {
    return handleErrorResponse(res, 400, "Invalid User Id");
  }

  try {
    // Query to find all items created by the current user
    const allStockItems = await ItemManagement.find({ created_by: userId });

    // Return success response with all stock items
    return handleSuccessResponse(res, "All Stock Items", allStockItems);
  } catch (error) {
    // Log the error and return an error response
    console.error("Error from ItemManagement Controller:", error.message);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};
