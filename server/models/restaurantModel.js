import mongoose from "mongoose";

// Define the restaurant schema
const restaurantSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: [true, "A restaurant must have an admin"],
    },
    restaurantName: {
      type: String,
      required: [true, "A restaurant must have a name"],
      trim: true,
    },
    ownerName: {
      type: String,
      required: [true, "A restaurant must have an Owner Name"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "A restaurant must have a phone number"],
    },
    email: {
      type: String,
      required: [true, "A restaurant must have an email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: "Please provide a valid email address",
      },
    },
    location: {
      type: String,
      required: [true, "A restaurant must have a location"],
    },
    address: {
      type: String,
      required: [true, "A restaurant must have an address"],
    },
    taxNumber: {
      type: String,
      required: [true, "A restaurant must have an Tax Number"],
    },
    tradeLicense: {
      type: String,
      required: [true, "A restaurant must have a trade license"],
    },
    businessLicense: {
      type: String,
      required: [true, "A restaurant must have a business license"],
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
