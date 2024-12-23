import mongoose from "mongoose";
import Employee from "./employeeModel.js";

const deliveryBoySchema = new mongoose.Schema({
  odometer_photo: {
    type: String,
    default: null,
  },
  odometer_reading: {
    type: Number,
    default: 0,
  },
  lastLocation: {
    lat: {
      type: Number,
      default: null,
    },
    lng: {
      type: Number,
      default: null,
    },
  },
});

export default Employee.discriminator("DeliveryBoy", deliveryBoySchema);
