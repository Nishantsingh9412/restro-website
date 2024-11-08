import { Schema, model } from "mongoose";

// Employee Schema Definition
const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    country_code: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        trim: true,
      },
      city: {
        type: String,
        trim: true,
      },
      zipCode: {
        type: String,
        trim: true,
      },
    },
    birthday: Date,
    nationality: {
      type: String,
      trim: true,
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
      default: "Single",
    },
    children: {
      type: Number,
      default: 0,
    },
    healthInsurance: {
      type: String,
      trim: true,
    },
    socialSecurityNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    taxID: {
      type: String,
      unique: true,
      trim: true,
    },
    dateOfJoining: Date,
    endOfEmployment: Date,
    role: {
      type: String,
      enum: [
        "Delivery Boy",
        "Chef",
        "Bar Tender",
        "Manager",
        "Kitchen Staff",
        "Waiter",
        "Custom",
      ],
      default: "Delivery Boy",
    },
    type: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Intern", "Contract"],
      default: "Full-Time",
    },
    workingHoursPerWeek: {
      type: Number,
      default: 40,
    },
    variableWorkingHours: {
      type: Boolean,
      default: false,
    },
    annualHolidayEntitlement: {
      type: Number,
      default: 20,
    },
    notes: {
      type: String,
      trim: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

// Add a custom validation for `dateOfJoining` and `endOfEmployment`
employeeSchema.pre("save", function (next) {
  if (this.endOfEmployment && this.dateOfJoining > this.endOfEmployment) {
    return next(new Error("End of employment cannot be before date of joining"));
  }
  next();
});


// Post middleware to handle cleanup after an employee is deleted
employeeSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const Shift = model("Shift");
    const Absence = model("Absence");

    // Delete related Shifts and Absences
    await Promise.all([
      Shift.deleteMany({ employeeId: doc._id }),
      Absence.deleteMany({ employeeId: doc._id }),
    ]);
  }
});

export default model("Employee", employeeSchema);
