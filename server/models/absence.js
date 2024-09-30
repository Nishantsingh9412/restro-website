import mongoose from "mongoose";

const AbsenceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    declineAssignedShifts: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Absence", AbsenceSchema);
