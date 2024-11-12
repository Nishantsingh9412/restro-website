import mongoose from "mongoose";
import Employee from "../employeeModel.js";

const staffSchema = new mongoose.Schema({
  section: {
    type: String,
  },
  experience: {
    type: Number,
  },
});

const Staff = Employee.discriminator("Staff", staffSchema);

export default Staff;
