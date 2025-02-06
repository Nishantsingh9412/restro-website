import mongoose from "mongoose";
import Employee from "../employeeModel.js";

const waiterSchema = new mongoose.Schema({
  section: {
    type: String,
  },
  experience: {
    type: Number,
  },
  assignedOrders: [
    {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "DineInOrder",
    },
  ],
});

export default Employee.discriminator("Waiter", waiterSchema);
