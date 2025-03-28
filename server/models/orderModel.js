import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OrderedItemsSchema = new Schema(
  {
    itemId: { type: String, required: true, unique: true },
    orderName: { type: String, required: true },
    category: { type: String, required: true },
    subItems: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        pic: { type: String },
      },
    ],
    priceVal: { type: Number, required: true },
    priceUnit: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dezifvepx/image/upload/v1712836597/restro-website/salad.png",
    },
    description: { type: String },
    isFavourite: { type: Boolean, default: false },
    isDrink: { type: Boolean, default: false },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("OrderedItems", OrderedItemsSchema);
