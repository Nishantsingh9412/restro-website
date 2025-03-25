import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { orderItemsSubDocsSchema } from "./deliveryOrder.js";

//Status History Schema
const statusHistorySchema = new Schema({
  status: {
    type: String,
    required: true,
    enum: [
      "Available",
      "Assigned",
      "Accepted",
      "Assigned To Chef",
      "Accepted By Chef",
      "Preparing",
      "Ready",
      "Served",
      "Cancelled",
      "Completed",
      "Rejected",
    ], // Possible statuses
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "updatedByModel",
  },
  updatedByModel: {
    type: String,
    required: true,
    enum: ["admin", "Waiter", "Chef", "Delivery Boy", "Manager"], // Models that can update the status
  },
  timestamp: {
    type: Date,
    default: Date.now, // Default to current date and time
  },
});
// Schema for dine-in orders
const dineInOrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true, // Order ID must be unique
      trim: true, // Trim whitespace
    },
    tableNumber: {
      type: Number,
      required: true,
    },
    numberOfGuests: {
      type: Number,
      required: true,
      min: [1, "Number of guests must be at least 1"], // Minimum number of guests
    },
    customerName: {
      type: String,
      trim: true, // Trim whitespace
    },
    phoneNumber: {
      type: String,
      trim: true, // Trim whitespace
    },
    emailAddress: {
      type: String,
      trim: true, // Trim whitespace
    },
    specialRequests: {
      type: String,
      trim: true, // Trim whitespace
    },
    orderItems: {
      type: [orderItemsSubDocsSchema], // Array of order items
      validate: {
        validator: function (v) {
          return v.length > 0; // Order must have at least one item
        },
        message: "Order must have at least one item.",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price must be a positive number"], // Total price must be a positive number
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // Reference to the Admin model
      required: true,
    },
    assignedWaiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Waiter", // Reference to the Waiter model
      default: null,
    },
    assignedChef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chef",
      default: null,
    },
    currentStatus: {
      type: String,
      enum: [
        "Available",
        "Assigned",
        "Accepted",
        "Assigned To Chef",
        "Accepted By Chef",
        "Preparing",
        "Ready",
        "Served",
        "Cancelled",
        "Completed",
        "Rejected",
      ], // Possible statuses
      default: "Available",
    },
    statusHistory: [statusHistorySchema],
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Export the model
export default model("DineInOrder", dineInOrderSchema);
