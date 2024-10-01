import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: {
      street: String,
      city: String,
      zipCode: String,
    },
    birthday: Date,
    nationality: String,
    maritalStatus: String,
    children: Number,
    healthInsurance: String,
    socialSecurityNumber: String,
    taxID: String,
    status: { type: String, required: true, enum: ["Active", "Inactive"] },
    dateOfJoining: Date,
    endOfEmployment: Date,
    employeeID: { type: String, required: true },
    position: String,
    type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract"],
    },
    workingHoursPerWeek: Number,
    variableWorkingHours: Boolean,
    annualHolidayEntitlement: Number,
    notes: String,
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { timestamps: true }
);

// EmployeeSchema.js

EmployeeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const Shift = mongoose.model("Shift");
    const Absence = mongoose.model("Absence");

    // Delete related Shifts
    await Shift.deleteMany({ employeeId: doc._id });

    // Delete related Absences
    await Absence.deleteMany({ employeeId: doc._id });
  }
});

export default mongoose.model("Employee", EmployeeSchema);
