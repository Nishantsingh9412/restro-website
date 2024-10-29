import mongoose from "mongoose";
import Employee from "./employeeModel.js";

const deliveryBoySchema = new mongoose.Schema({
  onlineStatus: {
    type: Boolean,
    default: false,
  },
  liveLocationURL: {
    type: String,
    default: "",
  },
});

export default Employee.discriminator("DeliveryBoy", deliveryBoySchema);
