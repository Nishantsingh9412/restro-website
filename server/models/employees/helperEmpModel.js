import mongoose from "mongoose";
import Employee from "../employeeModel.js";

const Schema = mongoose.Schema;

// HelperEmployee Schema extending Employee Schema
const helperEmpShema = new Schema({
  section: {
    type: String,
  },
  experience: {
    type: Number,
    default: 0,
  },
});

const HelperEmployee = Employee.discriminator("HelperEmployee", helperEmpShema);

export default HelperEmployee;
