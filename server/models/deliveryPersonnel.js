import mongoose from "mongoose";

const deliveryPersonnelSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country_code: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    receiveDeliveryOffers: {
      type: Boolean,
      default: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryPersonnel", deliveryPersonnelSchema);
