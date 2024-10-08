import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OrderedItemsSchema = new Schema(
  {
    orderName: { type: String, required: true },
    priceVal: { type: Number, required: true },
    priceUnit: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dezifvepx/image/upload/v1712836597/restro-website/salad.png",
    },
    description: { type: String },
    isFavorite: { type: Boolean, default: false },
    isDrink: { type: Boolean, default: false },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("OrderdItems", OrderedItemsSchema);
