import mongoose, { Schema } from "mongoose";

// Define the schema for notifications
const notificationSchema = mongoose.Schema(
  {
    // The sender of the notification
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Admin", "Employee"],
    },
    // The receiver of the notification
    receiver: {
      type: String,
      required: true,
    },
    // The heading/title of the notification
    heading: {
      type: String,
      required: true,
    },
    // The body/content of the notification
    body: {
      type: String,
      required: true,
    },
    // Navigation URL associated with the notification
    navURL: {
      type: String,
      default: "",
    },
    // Additional URL associated with the notification
    url: {
      type: String,
      default: "",
    },
  },
  // Automatically manage createdAt and updatedAt timestamps
  { timestamps: true }
);

// Export the Notification model
export default mongoose.model("Notification", notificationSchema);
