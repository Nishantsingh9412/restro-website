import mongoose from "mongoose";
import Employee from "../employeeModel.js";

const Schema = mongoose.Schema;

// Chef Schema extending Employee Schema
const chefSchema = new Schema({
  section: {
    type: String,
  },
  experience: {
    type: Number,
    default: 0,
  },
  assignedOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "orderType",
    },
  ],
  orderType: {
    type: String,
    enum: ["DineInOrder", "TakeAwayOrder"],
  },
});

const Chef = Employee.discriminator("Chef", chefSchema);

export default Chef;
