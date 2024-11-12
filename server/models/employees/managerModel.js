import mongoose from "mongoose";
import Employee from "../employeeModel.js";

const Schema = mongoose.Schema;

// Manager Schema extending Employee Schema
const managerSchema = new Schema({
  section: {
    type: String,
  },
  experience: {
    type: Number,
    default: 0,
  },
});

const Manager = Employee.discriminator("Manager", managerSchema);

export default Manager;
