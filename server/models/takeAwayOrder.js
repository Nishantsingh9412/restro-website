import mongoose from "mongoose";
import { orderItemsSubDocsSchema } from "./deliveryOrder.js";
const { Schema, model } = mongoose;

//Status History Schema
const statusHistorySchema = new Schema({
  status: {
    type: String,
    required: true,
    enum: [
      "Available",
      "Assigned",
      "Accepted",
      "Preparing",
      "Ready",
      "Completed",
      "Cancelled",
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

const takeAwaySchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true, // Order ID must be unique
      trim: true, // Trim whitespace
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    orderItems: {
      type: [orderItemsSubDocsSchema],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "Order must have at least one item.",
      },
    },
    totalPrice: {
      type: Number,
      required: true,
      min: [0, "Total price must be a positive number"],
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    assignedChef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chef",
      required: false,
    },
    currentStatus: {
      type: String,
      enum: [
        "Available",
        "Assigned",
        "Accepted",
        "Preparing",
        "Ready",
        "Completed",
        "Cancelled",
        "Rejected",
      ],
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

export default model("TakeAwayOrder", takeAwaySchema);
