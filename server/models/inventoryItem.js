import mongoose, { Schema } from "mongoose";

// Action history schema
const actionHistorySchema = new Schema({
  actionType: {
    type: String,
    required: true,
    enum: ["created", "updated", "deleted", "used"],
  },
  user: {
    type: Schema.Types.ObjectId,
    refPath: "userModel", // Dynamic reference
    required: true,
  },
  userModel: {
    type: String,
    required: true,
    enum: ["Admin", "Employee"], // Add your employee model name here
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Define the schema for item management
const itemManagementSchema = new Schema(
  {
    // Item name field
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    // Category field
    category: {
      type: String,
      trim: true,
    },
    // Item unit field
    itemUnit: {
      type: String,
      required: [true, "Item unit is required"],
      trim: true,
    },
    // Available quantity field
    availableQuantity: {
      type: Number,
      required: [true, "Available quantity is required"],
      min: [0, "Available quantity cannot be negative"],
    },
    // Low stock quantity field
    lowStockQuantity: {
      type: Number,
      min: [0, "Low stock quantity cannot be negative"],
    },
    // Bar code field
    barCode: {
      type: String,
      required: [true, "Bar code is required"],
      unique: true,
      trim: true,
    },

    // Expiry date field with validation
    expiryDate: {
      type: Date,
      validate: {
        validator: function (v) {
          return !v || v > Date.now(); // Expiry date should be in the future if provided
        },
        message: (props) =>
          `Expiry date (${props.value}) should be in the future`,
      },
    },
    // Purchase price field
    purchasePrice: {
      type: Number,
      min: [0, "Purchase price cannot be negative"],
    },
    // Supplier name field
    supplierName: {
      type: String,
      trim: true,
    },
    // Supplier contact field
    supplierContact: {
      type: String,
      trim: true,
    },
    // Action history
    actionHistory: [actionHistorySchema],
    // Notes field
    notes: {
      type: String,
      trim: true,
    },
    // Stored location field
    storedLocation: {
      type: String,
      trim: true,
    },
    // Created by field (reference to Admin model)
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "Created by is required"],
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export the model
export default mongoose.model("ItemManagement", itemManagementSchema);
