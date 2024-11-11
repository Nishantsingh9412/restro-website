import mongoose, { Schema } from "mongoose";

// Define the schema for item management
const itemManageMentSchema = new Schema(
  {
    // Item name field
    item_name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    // Item unit field
    item_unit: {
      type: String,
      required: [true, "Item unit is required"],
      trim: true,
    },
    // Available quantity field
    available_quantity: {
      type: Number,
      required: [true, "Available quantity is required"],
      min: [0, "Available quantity cannot be negative"],
    },
    // Minimum quantity field
    minimum_quantity: {
      type: Number,
      required: [true, "Minimum quantity is required"],
      min: [0, "Minimum quantity cannot be negative"],
    },
    // Bar code field
    bar_code: {
      type: String,
      required: [true, "Bar code is required"],
      unique: true,
      trim: true,
    },
    // Existing barcode number field
    existing_barcode_no: {
      type: String,
      trim: true,
    },
    // Expiry date field with validation
    expiry_date: {
      type: Date,
      validate: {
        validator: function (v) {
          return v > Date.now(); // Expiry date should be in the future
        },
        message: (props) =>
          `Expiry date (${props.value}) should be in the future`,
      },
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
export default mongoose.model("ItemManagement", itemManageMentSchema);
