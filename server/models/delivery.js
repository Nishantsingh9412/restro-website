import mongoose from "mongoose";

// Define the statusHistory sub-schema
const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const orderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  units: {
    type: Number,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
});

// Define the main order schema
const deliverySchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    pickupLocation: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    deliveryLocation: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    estimatedTime: {
      type: Number,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerContact: {
      type: String,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    restaurantImage: {
      type: String,
      default: "",
    },
    paymentType: {
      type: String,
      required: true,
    },
    currentStatus: {
      type: String,
      enum: ["Available", "Accepted", "Picked up", "Completed"],
      default: "Available",
    },
    statusHistory: [statusHistorySchema],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthDeliv",
      default: null,
    },
    timeTaken: {
      type: Number,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Delivery", deliverySchema);
