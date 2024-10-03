import mongoose from "mongoose";

// Employee Schema Definition
const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Employee's name
    email: { type: String, required: true }, // Employee's email
    phone: String, // Employee's phone number
    address: {
      street: String, // Street address
      city: String, // City
      zipCode: String, // Zip code
    },
    birthday: Date, // Employee's birthday
    nationality: String, // Employee's nationality
    maritalStatus: String, // Employee's marital status
    children: Number, // Number of children
    healthInsurance: String, // Health insurance details
    socialSecurityNumber: String, // Social security number
    taxID: String, // Tax ID
    status: { type: String, required: true, enum: ["Active", "Inactive"] }, // Employment status
    dateOfJoining: Date, // Date of joining
    endOfEmployment: Date, // End of employment date
    employeeID: { type: String, required: true }, // Employee ID
    position: String, // Position in the company
    type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract"], // Employment type
    },
    workingHoursPerWeek: Number, // Working hours per week
    variableWorkingHours: Boolean, // Variable working hours
    annualHolidayEntitlement: Number, // Annual holiday entitlement
    notes: String, // Additional notes
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true, // Reference to the user who created the record
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Post middleware to handle cleanup after an employee is deleted
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
