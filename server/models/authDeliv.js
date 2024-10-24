import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Define the schema for AuthDeliv
const authDelivSchema = new Schema(
  {
    name: { type: String, required: true },
    country_code: { type: String, required: true },
    phone: { type: String, required: true },
    isOnline: {
      type: Boolean,
      default: false,
    },
    liveLocationURL: {
      type: String,
      default: "",
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { timestamps: true }
);

// Export the model
export default model("AuthDeliv", authDelivSchema);
