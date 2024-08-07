import mongoose from "mongoose";

const orderItemsSubDocsSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderdItems",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const completeOrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    deliveryMethod: {
      type: String,
      required: false,
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
    pickupLocationName: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    address2: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    zip: {
      type: String,
      required: false,
    },
    noteFromCustomer: {
      type: String,
      required: false,
    },
    orderItems: [orderItemsSubDocsSchema],
    TotalPrice: {
      type: Number,
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CompleteOrder", completeOrderSchema);
