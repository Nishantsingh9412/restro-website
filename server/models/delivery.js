import mongoose from "mongoose";

// Define the statusHistory sub-schema to track status changes over time
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

// Define the orderItem sub-schema to represent individual items in an order
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

// Define the main delivery schema to represent a delivery record
const deliverySchema = new mongoose.Schema(
  {
    // Reference to the supplier
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    // Unique identifier for the order
    orderId: {
      type: String,
      required: true,
    },
    // Pickup location coordinates
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
    // Delivery location coordinates
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
    // Delivery address
    deliveryAddress: {
      type: String,
      required: true,
    },
    // Distance to be covered for the delivery
    distance: {
      type: Number,
      required: true,
    },
    // Estimated time for delivery in minutes
    estimatedTime: {
      type: Number,
      required: true,
    },
    // Customer's name
    customerName: {
      type: String,
      required: true,
    },
    // Customer's contact information
    customerContact: {
      type: String,
      required: true,
    },
    // Name of the restaurant
    restaurantName: {
      type: String,
      required: true,
    },
    // Image URL of the restaurant
    restaurantImage: {
      type: String,
      default: "",
    },
    // Payment type (e.g., cash, card)
    paymentType: {
      type: String,
      required: true,
    },
    // Current status of the delivery
    currentStatus: {
      type: String,
      enum: ["Available", "Accepted", "Picked up", "Completed"],
      default: "Available",
    },
    // History of status changes
    statusHistory: [statusHistorySchema],
    // Reference to the delivery person assigned
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy",
      default: null,
    },
    // Time taken for the delivery in minutes
    timeTaken: {
      type: Number,
      default: null,
    },
    // Timestamp when the delivery was completed
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Export the Delivery model
export default mongoose.model("Delivery", deliverySchema);
