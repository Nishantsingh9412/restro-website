import mongoose from "mongoose";
import Employee from "../employeeModel.js";

const waiterSchema = new mongoose.Schema({
  section: {
    type: String,
  },
  experience: {
    type: Number,
  },
});

export default Employee.discriminator("Waiter", waiterSchema);
