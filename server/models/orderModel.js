import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OrderedItemsSchema = new Schema(
  {
    itemId: { type: String, required: true, unique: true },
    itemName: { type: String, required: true },
    category: { type: String, required: true },
    customization: [
      {
        title: { type: String, required: true },
        maxSelect: { type: Number, required: true },
        required: { type: Boolean, required: true },
        option: [
          {
            name: { type: String, required: true },
            price: { type: Number, required: true },
          },
        ],
      },
    ],
    ingredients: [{ type: String }],
    basePrice: { type: Number, required: true },
    prepTime: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dezifvepx/image/upload/v1712836597/restro-website/salad.png",
      set: function (value) {
        return value === "" ? this.default : value;
      },
    },
    description: { type: String },
    isFavourite: { type: Boolean, default: false },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("OrderedItems", OrderedItemsSchema);
