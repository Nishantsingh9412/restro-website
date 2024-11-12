import mongoose from "mongoose";
import Employee from "../employeeModel.js";

const Schema = mongoose.Schema;

// Bartender Schema extending Employee Schema
const bartenderSchema = new Schema({
  section: {
    type: String,
  },
  experience: {
    type: Number,
    default: 0,
  },
});

const Bartender = Employee.discriminator("Bartender", bartenderSchema);

export default Bartender;
