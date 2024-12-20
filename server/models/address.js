import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
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
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
