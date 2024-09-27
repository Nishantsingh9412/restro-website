import mongoose from "mongoose";

const ShiftSchema = mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    date: { type: Date, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
    duration: { type: Number, required: true }, // Duration in hours
    note: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model("Shift", ShiftSchema);
