import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Subdocument schema for order items
const orderItemsSubDocsSchema = new Schema({
  item: {
    type: Schema.Types.ObjectId,
    ref: "OrderedItems", // Reference to the OrderedItems model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"], // Minimum quantity is 1
  },
  total: {
    type: Number,
    required: true,
    min: [0, "Total must be a positive number"], // Total must be a positive number
  },
});
// Schema for dine-in orders
const dineInOrderSchema = new Schema({
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
});

// Export the model
export default model("DineInOrder", dineInOrderSchema);
