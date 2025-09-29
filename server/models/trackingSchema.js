import mongoose from "mongoose";

const TrackingSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("TrackingSchema", TrackingSchema);
