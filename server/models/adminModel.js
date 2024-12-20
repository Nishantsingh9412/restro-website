import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Define the schema for the Admin model
const adminSchema = new Schema(
  {
    // Username field, must be unique and is required
    username: {
      type: String,
      required: true,
      trim: true,
    },
    // Password field, is required
    password: {
      type: String,
      required: true,
    },
    // Email field, must be unique and is required
    email: {
      type: String,
      required: true,
      unique: true,
    },
    //ID is verified or not
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Profile picture field, has a default value
    profile_picture: {
      type: String,
      default:
        "https://res.cloudinary.com/dezifvepx/image/upload/v1712570097/restro-website/dtqy5kkrwuuhamtp9gim.png",
    },
    // Role field, defaults to 'admin'
    role: {
      type: String,
      default: "admin",
    },
    // Unique identifier field, is required
    uniqueId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); // Automatically add createdAt and updatedAt timestamps

// Create the Admin model using the adminSchema
export default mongoose.model("Admin", adminSchema);
