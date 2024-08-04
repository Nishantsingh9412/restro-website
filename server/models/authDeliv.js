import mongoose from "mongoose";

const authDelivSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    country_code: { type: String, required: true },
    phone: { type: String, required: true },
    isOnline: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    // uniqueId: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("AuthDeliv", authDelivSchema);
