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

const takeAwaySchema = new Schema({
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
});

export default model("TakeAwayOrder", takeAwaySchema);
