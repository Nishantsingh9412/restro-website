import mongoose from "mongoose";

const { Schema, model } = mongoose;

const SupplierSchema = new Schema(
  {
    name: { type: String, required: true },
    items: { type: [String], required: true },
    pic: {
      type: String,
      default:
        "https://res.cloudinary.com/dezifvepx/image/upload/v1712570097/restro-website/dtqy5kkrwuuhamtp9gim.png",
    },
    countryCode: String,
    phone: String,
    email: String,
    location: String,
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Supplier", SupplierSchema);
