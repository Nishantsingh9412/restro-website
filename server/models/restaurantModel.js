import mongoose from "mongoose";

// Define the restaurant schema
const restaurantSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "A restaurant must have an admin"],
    },
    name: {
      type: String,
      required: [true, "A restaurant must have a name"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "A restaurant must have an address"],
    },
    phone: {
      type: String,
      required: [true, "A restaurant must have a phone number"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Pending",
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
        default: null,
      },
      lng: {
        type: Number,
        required: true,
        default: null,
      },
      // The required field should be at the same level as lat and lng
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

// Pre-save middleware to handle any necessary pre-save logic
restaurantSchema.pre("save", function (next) {
  // Ensure coordinates are in the correct format
  if (
    this.coordinates &&
    (this.coordinates.lat === null || this.coordinates.lng === null)
  ) {
    return next(
      new Error("Coordinates must be provided with both latitude and longitude")
    );
  }
  next();
});

// Create the Restaurant model from the schema
export default mongoose.model("Restaurant", restaurantSchema);
