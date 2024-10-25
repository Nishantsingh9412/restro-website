import mongoose from "mongoose";

// Define the schema for delivery personnel
const deliveryPersonnelSchema = mongoose.Schema(
  {
    // Name of the delivery personnel
    name: {
      type: String,
      required: true,
    },
    // Country code of the delivery personnel's phone number
    country_code: {
      type: String,
      required: true,
    },
    // Phone number of the delivery personnel
    phone: {
      type: String,
      required: true,
    },
    // Whether the delivery personnel wants to receive delivery offers
    receiveDeliveryOffers: {
      type: Boolean,
      default: true,
    },
    // Reference to the user who created this delivery personnel entry
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  // Automatically manage createdAt and updatedAt timestamps
  { timestamps: true }
);

// Export the model for use in other parts of the application
export default mongoose.model("DeliveryPersonnel", deliveryPersonnelSchema);
