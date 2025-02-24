import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Schema for individual order items
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

// Schema for the complete order
const DeliveryOrder = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Trim whitespace
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true, // Trim whitespace
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v); // Validate phone number format
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online", "offline", "alreadyPaid", "masterCard"], // Allowed payment methods
      default: "cash", // Default payment method
    },
    deliveryMethod: {
      type: String,
      enum: ["pickup", "delivery"], // Allowed delivery methods
      default: "pickup", // Default delivery method
    },
    dropLocation: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    dropLocationName: {
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
    address: {
      type: String,
      required: true,
      trim: true, // Trim whitespace
    },
    address2: {
      type: String,
      trim: true, // Trim whitespace
    },
    zip: {
      type: String,
      trim: true, // Trim whitespace
      validate: {
        validator: function (v) {
          return /\d{5}(-\d{4})?/.test(v); // Validate zip code format
        },
        message: (props) => `${props.value} is not a valid zip code!`,
      },
    },
    noteFromCustomer: {
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
    orderId: {
      type: String,
      required: true,
      unique: true, // Order ID must be unique
      trim: true, // Trim whitespace
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

export default model("DeliveryOrder", DeliveryOrder);
