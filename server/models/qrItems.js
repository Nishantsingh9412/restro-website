import mongoose, { Schema } from "mongoose";

const QrItemsManagementSchema = mongoose.Schema(
  {
    item_name: { type: String, required: true },
    item_unit: { type: String, required: true },
    item_count: { type: Number, required: true },
    qr_code: { type: String, required: true },
    available_quantity: { type: Number, required: true },
    minimum_quantity: { type: Number, required: true },
    usage_rate_value: { type: Number, required: true },
    usage_rate_unit: { type: String, required: true },
    // Last_Replenished : { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("QRItemManagement", QrItemsManagementSchema);
